import { ILLUSTRATION_FILL, ILLUSTRATION_STROKE } from "./shared";

type StepLocationIllustrationProps = {
  className?: string;
};

/**
 * Ambient outline illustration for the location step —
 * stylized castle, trees, path, and map pin. Decorative only.
 */
export function StepLocationIllustration({ className = "" }: StepLocationIllustrationProps) {
  return (
    <svg
      viewBox="0 0 220 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 118 Q70 88 130 108 Q175 122 220 112 L220 170 L10 170 Z"
        fill={ILLUSTRATION_FILL}
        stroke="none"
      />

      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="28" y1="118" x2="28" y2="98" />
        <path d="M28 98 C20 106 20 114 28 118 C36 114 36 106 28 98 Z" fill={ILLUSTRATION_FILL} />
        <line x1="52" y1="122" x2="52" y2="104" />
        <path d="M52 104 C46 110 46 116 52 122 C58 116 58 110 52 104 Z" fill={ILLUSTRATION_FILL} />

        <path d="M72 118 L72 82 L80 68 L88 82 L88 118" fill={ILLUSTRATION_FILL} />
        <path d="M80 68 L80 62 L88 68" />
        <path d="M88 118 L88 90 L108 78 L128 90 L128 118" fill={ILLUSTRATION_FILL} />
        <path d="M88 78 L92 78 L92 82 L96 82 L96 78 L100 78 L100 82 L104 82 L104 78 L108 78" />
        <path d="M128 118 L128 86 L136 74 L144 86 L144 118" fill={ILLUSTRATION_FILL} />
        <path d="M136 74 L136 68 L144 74" />
        <path d="M108 118 Q112 108 116 118" />
      </g>

      <path
        d="M116 118 C132 128 148 138 162 148 C172 154 180 158 188 162"
        stroke={ILLUSTRATION_STROKE}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeDasharray="5 6"
        fill="none"
      />

      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinejoin="round">
        <path
          d="M196 148 C196 140.82 190.18 135 183 135 C175.82 135 170 140.82 170 148 C170 156 183 168 183 168 C183 168 196 156 196 148 Z"
          fill={ILLUSTRATION_FILL}
        />
        <circle cx="183" cy="148" r="4.5" fill={ILLUSTRATION_FILL} />
      </g>

      <circle cx="158" cy="52" r="11" stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" fill={ILLUSTRATION_FILL} />
      <path d="M158 46 L160.5 54.5 L158 52 L155.5 54.5 Z" fill={ILLUSTRATION_STROKE} stroke="none" />
    </svg>
  );
}
