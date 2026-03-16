#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const REPO = process.env.TRACKS_REPO || process.env.GITHUB_REPOSITORY || "ohbm/hackathon2026";
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "";
const OUTPUT_PATH = path.join(process.cwd(), "src/data/tracks.generated.json");
const TEMPLATE_DIR = path.join(process.cwd(), ".github/ISSUE_TEMPLATE");

const HACKTRACK_LABELS = ["HackTrack Project", "Hackathon Project"];
const TRAINTRACK_LABELS = ["TrainTrack Tutorial", "Train Track Tutorial"];
const LABEL_PREFIXES = [":label: ", "🌐 ", ":computer: "];

function readIssueFields(filename) {
  const templatePath = path.join(TEMPLATE_DIR, filename);
  const template = yaml.load(fs.readFileSync(templatePath, "utf8"));
  return template.body.filter((field) => field.type !== "markdown");
}

function normalizeMultiline(value) {
  if (!value) {
    return null;
  }

  const trimmed = String(value)
    .replace(/<!--.*?-->/gs, "")
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();

  if (!trimmed || trimmed === "_No response_") {
    return null;
  }

  return trimmed;
}

function splitLines(value) {
  const normalized = normalizeMultiline(value);
  if (!normalized) {
    return [];
  }

  return normalized
    .split("\n")
    .map((line) => line.replace(/^[-*]\s*/, "").trim())
    .filter(Boolean);
}

function splitInlineList(value) {
  const normalized = normalizeMultiline(value);
  if (!normalized) {
    return [];
  }

  return normalized
    .split(/[,\n]/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function slugify(value, fallback) {
  const source = normalizeMultiline(value) || fallback;
  return source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function summarize(text, maxLength = 180) {
  const normalized = normalizeMultiline(text);
  if (!normalized) {
    return null;
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function getCheckboxOptions(field) {
  const options = field.attributes?.options || [];
  return options.map((option) => (typeof option === "string" ? option.trim() : String(option.label).trim()));
}

function parseIssueBody(body, fields) {
  const lines = body.replace(/\r\n/g, "\n").split("\n").map((line) => line.trim());

  const fieldOrdering = fields
    .map((field) => {
      const label = field.attributes?.label;
      const fieldStart = lines.findIndex((line) => line.startsWith(`### ${label}`));
      return { field, fieldStart };
    })
    .filter((entry) => entry.fieldStart !== -1)
    .sort((left, right) => left.fieldStart - right.fieldStart);

  const result = {};

  fieldOrdering.forEach((current, index) => {
    const next = fieldOrdering[index + 1];
    const start = current.fieldStart;
    const end = next ? next.fieldStart : lines.length;

    let fieldValue = normalizeMultiline(lines.slice(start + 1, end).join("\n"));

    if (current.field.type === "checkboxes") {
      const allowed = getCheckboxOptions(current.field);
      fieldValue = fieldValue
        ? fieldValue
            .split("\n")
            .filter((line) => line.startsWith("- [X] ") || line.startsWith("- [x] "))
            .map((line) => line.slice(6).trim())
            .filter((option) => allowed.includes(option))
        : [];
    }

    result[current.field.id] = fieldValue;
  });

  return result;
}

function collectCategories(issue, issueInfo, kind) {
  const labels = issue.labels.map((label) => label.name);
  const prefixed = labels
    .filter((label) => LABEL_PREFIXES.some((prefix) => label.startsWith(prefix)))
    .map((label) => {
      let stripped = label;
      LABEL_PREFIXES.forEach((prefix) => {
        if (stripped.startsWith(prefix)) {
          stripped = stripped.slice(prefix.length);
        }
      });
      return stripped.trim();
    });

  const fieldDerived = kind === "traintrack" ? splitInlineList(issueInfo.tags) : [];
  const hubs = [issueInfo.hub, ...(Array.isArray(issueInfo.otherhub) ? issueInfo.otherhub : [])];

  return unique([...prefixed, ...fieldDerived, ...hubs]);
}

function buildTrackEntry(kind, issue, issueInfo) {
  const labels = issue.labels.map((label) => label.name);
  const title = normalizeMultiline(issueInfo.title) || issue.title;
  const summary = kind === "hacktrack" ? issueInfo.goals : issueInfo.summary;

  return {
    id: `${kind}-${issue.number}`,
    kind,
    title,
    issueNumber: issue.number,
    issueUrl: issue.html_url,
    state: issue.state,
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    labels,
    categories: collectCategories(issue, issueInfo, kind),
    imageUrl: normalizeMultiline(issueInfo["website-image"]),
    summary: normalizeMultiline(summary),
    teaser: summarize(summary),
    primaryLink: normalizeMultiline(issueInfo.link),
    leads: kind === "hacktrack" ? splitLines(issueInfo["project-leads"]) : splitInlineList(issueInfo["tutor-names"]),
    hub: normalizeMultiline(issueInfo.hub),
    otherHubs: Array.isArray(issueInfo.otherhub) ? issueInfo.otherhub : [],
    skills: splitLines(issueInfo.skills),
    recommendedTutorials: splitLines(issueInfo.tutorials),
    goodFirstIssues: splitLines(issueInfo.issues),
    pitchLink: normalizeMultiline(issueInfo.pitch),
    shortName: slugify(issueInfo.chatchannel, title),
    recordingConsent: normalizeMultiline(issueInfo["recording-consent"]),
    duration: normalizeMultiline(issueInfo.duration),
    skillLevel: normalizeMultiline(issueInfo["skill-level"]),
    programmingLanguage: normalizeMultiline(issueInfo["programming-language"]),
    tags: splitInlineList(issueInfo.tags),
    reviewed: labels.some((label) => label.includes("Review")),
  };
}

async function fetchAllIssues() {
  const issues = [];
  let page = 1;

  while (true) {
    const url = `https://api.github.com/repos/${REPO}/issues?state=all&per_page=100&page=${page}`;
    const headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": "hackathon2026-track-sync",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    if (TOKEN) {
      headers.Authorization = `Bearer ${TOKEN}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`GitHub API ${response.status}: ${response.statusText}`);
    }

    const pageItems = await response.json();
    if (!Array.isArray(pageItems) || pageItems.length === 0) {
      break;
    }

    issues.push(...pageItems);

    if (pageItems.length < 100) {
      break;
    }

    page += 1;
  }

  return issues.filter((issue) => !issue.pull_request);
}

function writeOutput(payload) {
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function main() {
  const hacktrackFields = readIssueFields("brainhack-hacktrack-project.yml");
  const traintrackFields = readIssueFields("brainhack-traintrack-project.yml");

  try {
    const issues = await fetchAllIssues();
    const hacktrack = [];
    const traintrack = [];

    for (const issue of issues) {
      if (issue.state !== "open" || !issue.body) {
        continue;
      }

      const labels = issue.labels.map((label) => label.name);
      const isHacktrack = HACKTRACK_LABELS.some((label) => labels.includes(label));
      const isTraintrack = TRAINTRACK_LABELS.some((label) => labels.includes(label));

      if (!isHacktrack && !isTraintrack) {
        continue;
      }

      try {
        const fields = isHacktrack ? hacktrackFields : traintrackFields;
        const info = parseIssueBody(issue.body, fields);
        const entry = buildTrackEntry(isHacktrack ? "hacktrack" : "traintrack", issue, info);

        if (isHacktrack) {
          hacktrack.push(entry);
        } else {
          traintrack.push(entry);
        }
      } catch (error) {
        console.error(`Failed to parse issue #${issue.number}: ${error.message}`);
      }
    }

    hacktrack.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
    traintrack.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

    writeOutput({
      meta: {
        generatedAt: new Date().toISOString(),
        repository: REPO,
      },
      hacktrack,
      traintrack,
    });

    console.log(`Synced ${hacktrack.length} HackTrack and ${traintrack.length} TrainTrack entries.`);
  } catch (error) {
    if (fs.existsSync(OUTPUT_PATH)) {
      console.warn(`Track sync failed, keeping existing data: ${error.message}`);
      return;
    }

    console.warn(`Track sync failed, writing empty data: ${error.message}`);
    writeOutput({
      meta: {
        generatedAt: new Date().toISOString(),
        repository: REPO,
      },
      hacktrack: [],
      traintrack: [],
    });
  }
}

main();
