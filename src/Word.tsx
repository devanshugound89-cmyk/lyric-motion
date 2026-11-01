import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont();

interface WordProps {
  text: string;
  isHighlighted?: boolean;
}

export const Word: React.FC<WordProps> = ({ text, isHighlighted }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: {
      mass: 0.5,
      damping: 10,
      stiffness: 210,
    },
  });

  const glitchOffset = interpolate(frame, [0, 8], [8, 0], {
    extrapolateRight: "clamp",
  });

  const scale = interpolate(entrance, [0, 1], [0.4, 1]);
  const translateY = interpolate(entrance, [0, 1], [35, 0]);
  const opacity = interpolate(frame, [0, 4], [0, 1], {
    extrapolateRight: "clamp",
  });

  const baseShadow = isHighlighted
    ? `0 0 20px #00FFA3, 0 0 45px rgba(0, 255, 163, 0.6)`
    : `0 0 15px rgba(255, 255, 255, 0.25)`;

  const rgbSplit =
    glitchOffset > 0.1
      ? `, -${glitchOffset}px 0 rgba(255, 0, 85, 0.8), ${glitchOffset}px 0 rgba(0, 255, 255, 0.8)`
      : "";

  return (
    <span
      style={{
        display: "inline-block",
        margin: "0 14px",
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        fontFamily,
        fontSize: isHighlighted ? "108px" : "96px",
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "-1.5px",
        color: isHighlighted ? "#00FFA3" : "#F4F4F6",
        textShadow: `${baseShadow}${rgbSplit}`,
      }}
    >
      {text}
    </span>
  );
};
