import { ILLUSTRATION_FILL, ILLUSTRATION_STROKE } from "./shared";

type StepChildIllustrationProps = {
  className?: string;
  variant?: "first" | "second";
};

/** Balloon + flag on hill — child steps */
export function StepChildIllustration({
  className = "",
  variant = "first",
}: StepChildIllustrationProps) {
  const flagX = variant === "first" ? 152 : 168;
  const balloonX = variant === "first" ? 108 : 92;

  return (
    <svg
      viewBox="0 0 220 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 128 Q70 100 130 118 Q175 130 220 120 L220 170 L8 170 Z"
        fill={ILLUSTRATION_FILL}
      />

      <path
        d="M24 136 C48 124 72 118 96 122 C120 126 144 132 168 138"
        stroke={ILLUSTRATION_STROKE}
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={variant === "second" ? "5 6" : "0"}
      />

      {variant === "second" && (
        <path
          d="M96 122 C108 108 124 100 140 106"
          stroke={ILLUSTRATION_STROKE}
          strokeWidth="1.75"
          strokeLinecap="round"
          fill="none"
        />
      )}

      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinejoin="round">
        <ellipse cx={balloonX} cy="58" rx="18" ry="22" fill={ILLUSTRATION_FILL} />
        <path d={`M${balloonX - 4} 80 Q${balloonX} 98 ${balloonX + 2} 118`} fill="none" strokeLinecap="round" />
        <line x1={flagX} y1="118" x2={flagX} y2="86" strokeLinecap="round" />
        <path d={`M${flagX} 86 L${flagX + 22} 94 L${flagX} 102 Z`} fill={ILLUSTRATION_FILL} />
      </g>

      <circle cx="46" cy="52" r="3" fill={ILLUSTRATION_STROKE} />
      <circle cx="58" cy="44" r="2" fill={ILLUSTRATION_STROKE} />
      <circle cx="52" cy="36" r="2.5" fill={ILLUSTRATION_STROKE} />
    </svg>
  );
}
