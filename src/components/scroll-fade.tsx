"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ScrollFadeProps = {
  children: ReactNode;
  className?: string;
  enterScale?: number;
  exitScale?: number;
  blurPx?: number;
  travelY?: number;
  disableExit?: boolean;
};

type TransitionStyle = {
  opacity: number;
  transform: string;
  filter: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

export function ScrollFade({
  children,
  className,
  enterScale = 0.96,
  exitScale = 1.04,
  blurPx = 9,
  travelY = 34,
  disableExit = false,
}: ScrollFadeProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [styleState, setStyleState] = useState<TransitionStyle>({
    opacity: 0,
    transform: `translate3d(0, ${travelY}px, 0) scale(${enterScale})`,
    filter: "blur(0px)",
  });

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      const reducedMotionFrame = window.requestAnimationFrame(() => {
        setStyleState({
          opacity: 1,
          transform: "translate3d(0, 0, 0) scale(1)",
          filter: "blur(0px)",
        });
      });
      return () => window.cancelAnimationFrame(reducedMotionFrame);
    }

    let frameId = 0;

    const update = () => {
      const rect = target.getBoundingClientRect();
      const vh = window.innerHeight || 1;

      let opacity = 1;
      let scale = 1;
      let translateY = 0;
      let blur = 0;

      const enterStartTop = vh * 0.95; // section starts appearing from bottom
      const enterEndTop = vh * 0.68; // fully visible around this point
      const enterUpper = Math.max(enterStartTop, enterEndTop);
      const enterLower = Math.min(enterStartTop, enterEndTop);

      // Start dissolving when the next section occupies about half of the viewport.
      const exitStartBottom = vh * 0.5;
      const exitEndBottom = -vh * 0.15; // fully gone just after crossing top
      const exitUpper = Math.max(exitStartBottom, exitEndBottom);
      const exitLower = Math.min(exitStartBottom, exitEndBottom);

      if (rect.top >= enterUpper) {
        opacity = 0;
        scale = enterScale;
        translateY = travelY;
      } else if (rect.top > enterLower) {
        const t = clamp((enterUpper - rect.top) / (enterUpper - enterLower), 0, 1);
        opacity = lerp(0, 1, t);
        scale = lerp(enterScale, 1, t);
        translateY = lerp(travelY, 0, t);
      } else if (disableExit || rect.bottom > exitUpper) {
        // Hold zone: keep the current section crisp and stable.
        opacity = 1;
        scale = 1;
        translateY = 0;
        blur = 0;
      } else if (rect.bottom > exitLower) {
        const t = clamp((exitUpper - rect.bottom) / (exitUpper - exitLower), 0, 1);
        opacity = lerp(1, 0, t);
        scale = lerp(1, exitScale, t);
        translateY = lerp(0, -Math.round(travelY * 0.32), t);
        blur = lerp(0, blurPx, t);
      } else {
        opacity = 0;
        scale = exitScale;
        translateY = -Math.round(travelY * 0.32);
        blur = blurPx;
      }

      setStyleState({
        opacity,
        transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
        filter: `blur(${blur}px)`,
      });
    };

    const schedule = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [blurPx, disableExit, enterScale, exitScale, travelY]);

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-x-clip will-change-transform motion-reduce:opacity-100 motion-reduce:transform-none",
        className,
      )}
      style={{
        opacity: styleState.opacity,
        transform: styleState.transform,
        filter: styleState.filter,
        transitionProperty: "opacity, transform, filter",
        transitionDuration: "220ms, 260ms, 260ms",
        transitionTimingFunction: "linear, cubic-bezier(0.22, 1, 0.36, 1), cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
    </div>
  );
}
