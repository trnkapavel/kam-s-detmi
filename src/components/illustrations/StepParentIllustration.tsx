import { ILLUSTRATION_FILL, ILLUSTRATION_STROKE } from "./shared";

type StepParentIllustrationProps = {
  className?: string;
};

/** Trail with signpost — parent energy / time step */
export function StepParentIllustration({ className = "" }: StepParentIllustrationProps) {
  return (
    <svg
      viewBox="0 0 220 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0 130 Q55 108 110 122 Q165 136 220 124 L220 170 L0 170 Z"
        fill={ILLUSTRATION_FILL}
      />

      <path
        d="M30 138 C55 120 80 112 108 118 C135 124 160 132 188 140"
        stroke={ILLUSTRATION_STROKE}
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
      />

      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="118" y1="118" x2="118" y2="82" />
        <line x1="118" y1="82" x2="98" y2="72" />
        <line x1="118" y1="82" x2="138" y2="68" />
        <rect x="90" y="68" width="52" height="14" rx="3" fill={ILLUSTRATION_FILL} />
        <line x1="98" y1="72" x2="90" y2="68" />
        <line x1="138" y1="68" x2="142" y2="62" />
      </g>

      <circle cx="52" cy="48" r="14" stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" fill={ILLUSTRATION_FILL} />
      <path
        d="M52 34 L52 48 M44 40 L60 40 M46 52 L58 44"
        stroke={ILLUSTRATION_STROKE}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M168 108 L176 96 L184 108"
        stroke={ILLUSTRATION_STROKE}
        strokeWidth="1.75"
        strokeLinejoin="round"
        fill={ILLUSTRATION_FILL}
      />
      <line x1="176" y1="96" x2="176" y2="118" />
    </svg>
  );
}
