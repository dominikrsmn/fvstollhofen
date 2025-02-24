"use client";

import { ReactNode } from "react";

interface TimelineProps {
  children: ReactNode;
}

export function Timeline({ children }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute md:left-1/2 left-4 transform md:-translate-x-1/2 h-full w-1 bg-primary/20" />

      {/* Top fade gradient */}
      <div className="absolute md:left-1/2 left-4 transform md:-translate-x-1/2 top-0 w-1 h-24 bg-gradient-to-b from-background via-background/80 to-transparent z-10" />

      {/* Bottom fade gradient */}
      <div className="absolute md:left-1/2 left-4 transform md:-translate-x-1/2 bottom-0 w-1 h-24 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />

      {/* Timeline content */}
      <div className="relative">{children}</div>
    </div>
  );
}
