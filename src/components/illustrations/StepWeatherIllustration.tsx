import { ILLUSTRATION_FILL, ILLUSTRATION_STROKE } from "./shared";

type StepWeatherIllustrationProps = {
  className?: string;
};

/** Sun, cloud, and thermometer — weather step */
export function StepWeatherIllustration({ className = "" }: StepWeatherIllustrationProps) {
  return (
    <svg
      viewBox="0 0 220 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="62" cy="52" r="18" stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" fill={ILLUSTRATION_FILL} />
      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.5" strokeLinecap="round">
        <line x1="62" y1="24" x2="62" y2="30" />
        <line x1="62" y1="74" x2="62" y2="80" />
        <line x1="34" y1="52" x2="40" y2="52" />
        <line x1="84" y1="52" x2="90" y2="52" />
        <line x1="42" y1="32" x2="46" y2="36" />
        <line x1="78" y1="68" x2="82" y2="72" />
      </g>

      <path
        d="M98 58 C98 46 110 38 124 42 C128 30 144 28 156 38 C168 48 166 64 154 70 C158 78 152 88 140 88 C124 88 98 78 98 58 Z"
        stroke={ILLUSTRATION_STROKE}
        strokeWidth="1.75"
        fill={ILLUSTRATION_FILL}
        strokeLinejoin="round"
      />

      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinejoin="round">
        <rect x="168" y="54" width="16" height="64" rx="8" fill={ILLUSTRATION_FILL} />
        <circle cx="176" cy="108" r="10" fill={ILLUSTRATION_FILL} />
        <line x1="176" y1="66" x2="176" y2="100" strokeLinecap="round" />
        <line x1="172" y1="78" x2="176" y2="78" strokeWidth="2" />
        <line x1="172" y1="90" x2="176" y2="90" strokeWidth="2" />
      </g>

      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.5" strokeLinecap="round">
        <line x1="118" y1="128" x2="118" y2="138" />
        <line x1="128" y1="132" x2="128" y2="142" />
        <line x1="138" y1="128" x2="138" y2="136" />
      </g>

      <path
        d="M24 132 C40 124 56 120 72 124"
        stroke={ILLUSTRATION_STROKE}
        strokeWidth="1.75"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
