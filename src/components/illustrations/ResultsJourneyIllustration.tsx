import { ILLUSTRATION_FILL, ILLUSTRATION_STROKE } from "./shared";

type ResultsJourneyIllustrationProps = {
  className?: string;
};

/** Compass + dotted route to flag — results header */
export function ResultsJourneyIllustration({ className = "" }: ResultsJourneyIllustrationProps) {
  return (
    <svg
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="88" cy="78" r="34" stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" fill={ILLUSTRATION_FILL} />
      <circle cx="88" cy="78" r="22" stroke={ILLUSTRATION_STROKE} strokeWidth="1.5" fill="none" />
      <path d="M88 50 L92 78 L88 106 L84 78 Z" fill={ILLUSTRATION_STROKE} stroke="none" />
      <path d="M60 78 L116 78 M88 50 L88 106" stroke={ILLUSTRATION_STROKE} strokeWidth="1.25" strokeLinecap="round" />

      <path
        d="M128 108 C148 100 168 96 188 100 C204 103 216 112 224 122"
        stroke={ILLUSTRATION_STROKE}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeDasharray="5 7"
        fill="none"
      />

      <circle cx="148" cy="100" r="3" fill={ILLUSTRATION_STROKE} />
      <circle cx="178" cy="98" r="3" fill={ILLUSTRATION_STROKE} />
      <circle cx="206" cy="110" r="3" fill={ILLUSTRATION_STROKE} />

      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinejoin="round">
        <line x1="214" y1="138" x2="214" y2="104" strokeLinecap="round" />
        <path d="M214 104 L236 114 L214 124 Z" fill={ILLUSTRATION_FILL} />
      </g>

      <path
        d="M16 148 Q60 128 104 138 Q148 148 192 136"
        stroke={ILLUSTRATION_STROKE}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
