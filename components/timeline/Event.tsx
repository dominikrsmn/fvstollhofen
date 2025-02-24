"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface EventProps {
  date: string;
  content: string;
  image?: string;
  position: "left" | "right";
}

export function Event({ date, content, image, position }: EventProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex items-center my-8">
      {/* Timeline point */}
      <div
        className={cn(
          "absolute md:left-1/2 left-4 transform -translate-x-[6px] md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full transition-all duration-200 z-20",
          isHovered && "scale-150"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* Content container */}
      <div
        className={cn(
          "w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-6 bg-card rounded-lg shadow-sm",
          // Mobile: Always on right
          "ml-8",
          // Desktop: Alternate between left and right
          position === "left"
            ? "md:mr-auto md:ml-0 md:text-right"
            : "md:ml-[calc(50%+2rem)] md:text-left"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Date */}
        <div className="text-sm text-muted-foreground mb-2">{date}</div>

        {/* HTML Content */}
        <div
          className={cn(
            "prose prose-sm dark:prose-invert max-w-none",
            // Custom heading styles
            "prose-headings:text-foreground prose-h1:text-xl prose-h1:font-bold prose-h1:mb-2",
            "prose-h2:text-lg prose-h2:font-semibold prose-h2:mb-2",
            "prose-h3:text-base prose-h3:font-medium prose-h3:mb-2",
            // Paragraph styles
            "prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4 last:prose-p:mb-0",
            // Strong/bold text
            "prose-strong:text-foreground prose-strong:font-semibold",
            // List styles
            "prose-ul:list-disc prose-ul:ml-4 prose-ul:text-muted-foreground",
            "prose-ol:list-decimal prose-ol:ml-4 prose-ol:text-muted-foreground",
            // Link styles
            "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
            // Text alignment: left on mobile, follows position on desktop
            "text-left",
            position === "left" ? "md:text-right" : "md:text-left"
          )}
          dangerouslySetInnerHTML={{ __html: content }}
        />

        {/* Image if available */}
        {image && (
          <div className="mt-4 relative w-full aspect-video">
            <Image
              src={image}
              alt={`Event from ${date}`}
              fill
              className="object-cover rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}
