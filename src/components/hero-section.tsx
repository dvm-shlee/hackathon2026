"use client";

import { MapPin, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

const basePath = process.env.NODE_ENV === "production" ? "/hackathon2026" : "";

interface NeuralNetworkProps {
  className?: string;
  scrollProgress?: number;
}

function NeuralNetwork({ className, scrollProgress = 0 }: NeuralNetworkProps) {
  const MAIN_COLOR = "#00f2ff";
  // Define nodes in an Axial Brain layout
  // (Left Hemi x < 100, Right Hemi x > 100, Anterior y < 100, Posterior y > 100)
  const baseNodes = [
    // --- Midline / Central Hubs (Corpus Callosum & Thalamus) ---
    { id: 1, cx: 100, cy: 75, scatterX: -20, scatterY: 300 },
    { id: 2, cx: 100, cy: 105, scatterX: 15, scatterY: 350 },
    { id: 3, cx: 100, cy: 135, scatterX: -10, scatterY: 400 },

    // --- Left Hemisphere Perimeter (Front to Back) ---
    { id: 4, cx: 85, cy: 35, scatterX: -80, scatterY: 250 },
    { id: 5, cx: 60, cy: 55, scatterX: -120, scatterY: 320 },
    { id: 6, cx: 40, cy: 90, scatterX: -150, scatterY: 380 },
    { id: 7, cx: 45, cy: 130, scatterX: -130, scatterY: 420 },
    { id: 8, cx: 65, cy: 160, scatterX: -90, scatterY: 480 },
    { id: 9, cx: 90, cy: 175, scatterX: -40, scatterY: 520 },

    // --- Left Hemisphere Internal ---
    { id: 10, cx: 75, cy: 75, scatterX: -60, scatterY: 290 },
    { id: 11, cx: 70, cy: 110, scatterX: -70, scatterY: 360 },
    { id: 12, cx: 80, cy: 140, scatterX: -50, scatterY: 440 },

    // --- Right Hemisphere Perimeter (Front to Back) ---
    { id: 13, cx: 115, cy: 35, scatterX: 80, scatterY: 260 },
    { id: 14, cx: 140, cy: 55, scatterX: 120, scatterY: 310 },
    { id: 15, cx: 160, cy: 90, scatterX: 150, scatterY: 370 },
    { id: 16, cx: 155, cy: 130, scatterX: 130, scatterY: 430 },
    { id: 17, cx: 135, cy: 160, scatterX: 90, scatterY: 490 },
    { id: 18, cx: 110, cy: 175, scatterX: 40, scatterY: 530 },

    // --- Right Hemisphere Internal ---
    { id: 19, cx: 125, cy: 75, scatterX: 60, scatterY: 300 },
    { id: 20, cx: 130, cy: 110, scatterX: 70, scatterY: 350 },
    { id: 21, cx: 120, cy: 140, scatterX: 50, scatterY: 450 },
  ];

  // Define connections
  const connections = [
    // --- Central Bridge (Connecting Hemispheres) ---
    { from: 10, to: 1 },
    { from: 19, to: 1 },
    { from: 11, to: 2 },
    { from: 20, to: 2 },
    { from: 12, to: 3 },
    { from: 21, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 3 }, // Vertical spine

    // --- Left Hemisphere Perimeter Loop ---
    { from: 4, to: 5 },
    { from: 5, to: 6 },
    { from: 6, to: 7 },
    { from: 7, to: 8 },
    { from: 8, to: 9 },
    { from: 4, to: 10 },

    // --- Left Internal Wiring ---
    { from: 10, to: 5 },
    { from: 10, to: 11 },
    { from: 11, to: 6 },
    { from: 11, to: 12 },
    { from: 12, to: 7 },
    { from: 12, to: 8 },
    { from: 12, to: 9 },

    // --- Right Hemisphere Perimeter Loop ---
    { from: 13, to: 14 },
    { from: 14, to: 15 },
    { from: 15, to: 16 },
    { from: 16, to: 17 },
    { from: 17, to: 18 },
    { from: 13, to: 19 },

    // --- Right Internal Wiring ---
    { from: 19, to: 14 },
    { from: 19, to: 20 },
    { from: 20, to: 15 },
    { from: 20, to: 21 },
    { from: 21, to: 16 },
    { from: 21, to: 17 },
    { from: 21, to: 18 },
  ];

  // Calculate scattered positions based on scroll progress
  const nodes = baseNodes.map((node) => ({
    ...node,
    currentX: node.cx + node.scatterX * scrollProgress,
    currentY: node.cy + node.scatterY * scrollProgress,
  }));

  // Connection opacity fades as nodes scatter
  const connectionOpacity = Math.max(0, 1 - scrollProgress * 2);

  const getNode = (id: number) => nodes.find((n) => n.id === id)!;

  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      // Added aria-label for accessibility since this is a visual representation
      aria-label="Neural Network Brain Visualization"
    >
      <defs>
        {/* --- 1. THE GLOW FILTER --- */}
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
          {/* Blur the input to create the glow */}
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          {/* Merge the blur with the original sharp image */}
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* --- 2. ANIMATED GRADIENT FOR SIGNALS --- */}
        {connections.map((conn, i) => {
          const from = getNode(conn.from);
          const to = getNode(conn.to);
          return (
            <linearGradient
              key={`grad-${i}`}
              id={`signalGradient-${i}`}
              gradientUnits="userSpaceOnUse"
              x1={from.cx}
              y1={from.cy}
              x2={to.cx}
              y2={to.cy}
            >
              <stop offset="0%" stopColor={MAIN_COLOR} stopOpacity="0">
                <animate
                  attributeName="offset"
                  values="-0.3;1"
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${(i % 5) * 0.2}s`}
                />
              </stop>
              {/* Main color for the moving pulse */}
              <stop offset="20%" stopColor={MAIN_COLOR} stopOpacity="1">
                <animate
                  attributeName="offset"
                  values="-0.1;1.2"
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${(i % 5) * 0.2}s`}
                />
              </stop>
              <stop offset="40%" stopColor={MAIN_COLOR} stopOpacity="0">
                <animate
                  attributeName="offset"
                  values="0.1;1.4"
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${(i % 5) * 0.2}s`}
                />
              </stop>
            </linearGradient>
          );
        })}
      </defs>
      {/* Base Connections (Dim Background Lines) */}
      {connections.map((conn, i) => {
        const from = getNode(conn.from);
        const to = getNode(conn.to);
        return (
          <line
            key={`line-base-${i}`}
            x1={from.currentX}
            y1={from.currentY}
            x2={to.currentX}
            y2={to.currentY}
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary/20"
            style={{ 
              opacity: connectionOpacity,
              transition: "all 0.1s ease-out"
            }}
          />
        );
      })}

      {/* Active Signal Lines (Bright Animated Pulses) */}
      {connections.map((conn, i) => {
        const from = getNode(conn.from);
        const to = getNode(conn.to);
        return (
          <line
            key={`line-signal-${i}`}
            x1={from.currentX}
            y1={from.currentY}
            x2={to.currentX}
            y2={to.currentY}
            stroke={`url(#signalGradient-${i})`}
            strokeWidth="2"
            className="text-primary"
            style={{ 
              mixBlendMode: "screen",
              opacity: connectionOpacity,
              transition: "all 0.1s ease-out"
            }}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <g 
          key={node.id}
          style={{ transition: "all 0.1s ease-out" }}
        >
          {/* Outer glow ring (Pulse) */}
          <circle cx={node.currentX} cy={node.currentY} r="4" className="fill-brain/10">
            <animate
              attributeName="r"
              values="4;8;4"
              dur={`${2 + (i % 4) * 0.5}s`}
              repeatCount="indefinite"
              begin={`${i * 0.1}s`}
            />
            <animate
              attributeName="opacity"
              values="0.1;0.4;0.1"
              dur={`${2 + (i % 4) * 0.5}s`}
              repeatCount="indefinite"
              begin={`${i * 0.1}s`}
            />
          </circle>

          {/* Inner semi-transparent circle */}
          <circle cx={node.currentX} cy={node.currentY} r="3.5" className="fill-brain/60">
            <animate
              attributeName="r"
              values="3;4;3"
              dur={`${2 + (i % 4) * 0.5}s`}
              repeatCount="indefinite"
              begin={`${i * 0.1}s`}
            />
          </circle>

          {/* Hard Core (Data Point) */}
          <circle cx={node.currentX} cy={node.currentY} r="1.5" className="fill-brain" />
        </g>
      ))}
    </svg>
  );
}

function ScanRing({ scrollProgress = 0 }: { scrollProgress?: number }) {
  // Ring opacity fades as user scrolls
  const ringOpacity = Math.max(0, 1 - scrollProgress * 1.5);
  
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center overflow-visible">
      {/* Outer scanning rings */}
      <div
        className="absolute inset-0 rounded-full border border-primary/20 text-primary/20"
        style={{
          animation: "pulse 4s ease-out infinite -1s",
          boxShadow: "0 0 4px currentColor, 0 0 7px currentColor",
          opacity: ringOpacity,
          transition: "opacity 0.1s ease-out",
        }}
      />
      <div
        className="absolute inset-4 rounded-full border border-primary/30 text-primary/30"
        style={{
          animation: "pulse 4s ease-out infinite -0.5s",
          boxShadow: "0 0 4px currentColor, 0 0 7px currentColor",
          opacity: ringOpacity,
          transition: "opacity 0.1s ease-out",
        }}
      />
      <div
        className="absolute inset-8 rounded-full border border-primary/40 text-primary/40"
        style={{
          animation: "pulse 4s ease-out infinite 0s",
          boxShadow: "0 0 5px currentColor, 0 0 9px currentColor",
          opacity: ringOpacity,
          transition: "opacity 0.1s ease-out",
        }}
      />

      {/* Neural network in center */}
      <NeuralNetwork 
        className="w-32 h-32 md:w-60 md:h-60 text-primary relative z-10" 
        scrollProgress={scrollProgress}
      />
    </div>
  );
}

export function HeroSection() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const scrollY = window.scrollY;
      const sectionHeight = sectionRef.current.offsetHeight;
      // Calculate progress: 0 at top, 1 when scrolled past the section
      const progress = Math.min(1, Math.max(0, scrollY / (sectionHeight * 0.5)));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col">
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
            <Image
              src={`${basePath}/ossig_logo.svg`}
              alt="Ossig Logo"
              width={40}
              height={40}
            />
          </div>
          <span className="font-semibold tracking-tight">Hackathon</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#about" className="hover:text-foreground transition-colors">
            About
          </a>
          <a
            href="#schedule"
            className="hover:text-foreground transition-colors"
          >
            Schedule
          </a>
          <a
            href="#hack-track"
            className="hover:text-foreground transition-colors"
          >
            Hack Track
          </a>
          <a
            href="#train-track"
            className="hover:text-foreground transition-colors"
          >
            Train Track
          </a>
          <a
            href="#workshop"
            className="hover:text-foreground transition-colors"
          >
            Workshop
          </a>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 bg-[radial-gradient(circle_at_center,_#1f2937_0%,_#000000_70%)] overflow-visible">
          <ScanRing scrollProgress={scrollProgress} />
        </div>

        <p className="text-muted-foreground text-sm md:text-base tracking-widest uppercase mb-4">
          3 days of neuroimaging innovation
        </p>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance max-w-4xl leading-tight">
          Decode the brain in
          <br />
          <span className="text-muted-foreground">Bordeaux, France</span>
        </h1>

        <p className="mt-6 text-muted-foreground text-lg max-w-2xl text-balance">
          Join researchers, developers, and neuroscientists to build the next
          generation of MRI, EEG, and brain imaging tools.
        </p>
      </div>

      {/* Bottom Info Bar */}
      <div className="border-t border-border px-6 md:px-12 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>Bordeaux, France</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>June 11-13, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>3 Days</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm">More details</span>
            <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
              TBA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
