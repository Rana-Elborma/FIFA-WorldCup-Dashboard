import React, { useState } from "react";

export interface BubbleTextProps {
  /** The text string to render with the bubble effect */
  text: string;
  /** Tailwind classes applied to the outer wrapper (use text-Xzl for sizing) */
  className?: string;
  /** Additional inline styles on the wrapper */
  style?: React.CSSProperties;
  /** Tailwind color class for default (non-hovered) characters */
  baseColor?: string;
  /** Tailwind color class for the directly hovered character (distance 0) */
  hoverColor0?: string;
  /** Tailwind color class for immediate neighbours (distance 1) */
  hoverColor1?: string;
  /** Tailwind color class for second-degree neighbours (distance 2) */
  hoverColor2?: string;
}

export function BubbleText({
  text,
  className = "",
  style,
  baseColor = "text-gray-500",
  hoverColor0 = "text-white",
  hoverColor1 = "text-gray-200",
  hoverColor2 = "text-gray-400",
}: BubbleTextProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <span
      onMouseLeave={() => setHoveredIndex(null)}
      className={`cursor-default select-none inline-block font-black ${className}`}
      style={style}
    >
      {text.split("").map((char, idx) => {
        const distance =
          hoveredIndex !== null ? Math.abs(hoveredIndex - idx) : null;

        let colorClass = baseColor;
        let scaleClass = "";
        let weightClass = "font-black";

        if (distance !== null) {
          switch (distance) {
            case 0:
              colorClass = hoverColor0;
              scaleClass = "scale-[1.35]";
              weightClass = "font-black";
              break;
            case 1:
              colorClass = hoverColor1;
              scaleClass = "scale-[1.15]";
              weightClass = "font-black";
              break;
            case 2:
              colorClass = hoverColor2;
              scaleClass = "scale-[1.05]";
              weightClass = "font-black";
              break;
            default:
              break;
          }
        }

        return (
          <span
            key={idx}
            onMouseEnter={() => setHoveredIndex(idx)}
            className={`
              inline-block
              transition-all duration-200 ease-out
              ${colorClass}
              ${scaleClass}
              ${weightClass}
            `}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </span>
  );
}
