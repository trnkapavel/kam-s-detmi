import type { ActivityType } from "@/types";
import { ILLUSTRATION_FILL, ILLUSTRATION_STROKE } from "./shared";

type IllustrationProps = {
  className?: string;
};

type ActivityTypeIllustrationProps = {
  type: ActivityType;
  className?: string;
};

const svgProps = {
  viewBox: "0 0 220 170",
  fill: "none" as const,
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true as const,
};

function WaterIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M0 118 Q55 98 110 112 Q165 126 220 108 L220 170 L0 170 Z" fill={ILLUSTRATION_FILL} />
      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 118 L24 78 L196 78 L196 118" fill={ILLUSTRATION_FILL} />
        <path d="M36 118 L36 90 L184 90 L184 118" />
        <path d="M48 102 L62 96 L76 102 L90 96 L104 102" />
        <path d="M48 112 L64 106 L80 112 L96 106 L112 112" />
        <path d="M150 78 L150 52 L168 40 L186 52 L186 78" fill={ILLUSTRATION_FILL} />
        <path d="M168 40 L168 34 L186 40" />
      </g>
    </svg>
  );
}

function OutdoorWaterIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="176" cy="42" r="14" stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" fill={ILLUSTRATION_FILL} />
      <path d="M0 126 Q60 108 120 120 Q170 130 220 118 L220 170 L0 170 Z" fill={ILLUSTRATION_FILL} />
      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 126 C40 118 60 122 80 116 C100 110 120 114 140 108 C160 102 180 106 200 100" />
        <path d="M24 132 C44 124 64 128 84 122 C104 116 124 120 144 114 C164 108 184 112 204 106" />
        <path d="M48 98 L48 72 C48 64 56 58 64 58 C72 58 80 64 80 72 L80 98" fill={ILLUSTRATION_FILL} />
      </g>
    </svg>
  );
}

function ForestIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M0 128 Q70 108 140 122 Q180 130 220 120 L220 170 L0 170 Z" fill={ILLUSTRATION_FILL} />
      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="42" y1="128" x2="42" y2="96" />
        <path d="M42 96 C34 104 34 112 42 120 C50 112 50 104 42 96 Z" fill={ILLUSTRATION_FILL} />
        <line x1="78" y1="128" x2="78" y2="84" />
        <path d="M78 84 C68 94 68 106 78 116 C88 106 88 94 78 84 Z" fill={ILLUSTRATION_FILL} />
        <line x1="118" y1="128" x2="118" y2="92" />
        <path d="M118 92 C110 100 110 110 118 118 C126 110 126 100 118 92 Z" fill={ILLUSTRATION_FILL} />
        <line x1="162" y1="128" x2="162" y2="100" />
        <path d="M162 100 C154 108 154 116 162 124 C170 116 170 108 162 100 Z" fill={ILLUSTRATION_FILL} />
      </g>
    </svg>
  );
}

function ParkIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M0 130 Q80 112 160 126 Q190 132 220 124 L220 170 L0 170 Z" fill={ILLUSTRATION_FILL} />
      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="98" y1="130" x2="98" y2="72" />
        <circle cx="98" cy="58" r="18" fill={ILLUSTRATION_FILL} />
        <path d="M132 130 L132 108 L168 108 L168 130" fill={ILLUSTRATION_FILL} />
        <line x1="144" y1="108" x2="144" y2="98" />
        <line x1="156" y1="108" x2="156" y2="98" />
      </g>
    </svg>
  );
}

function NatureIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M0 132 Q70 108 140 120 Q185 128 220 116 L220 170 L0 170 Z" fill={ILLUSTRATION_FILL} />
      <path d="M48 132 C72 118 96 124 120 112 C144 100 168 108 192 96" stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinecap="round" fill="none" />
      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M156 132 L156 104 C156 96 164 90 172 90 C180 90 188 96 188 104 L188 132" fill={ILLUSTRATION_FILL} />
        <circle cx="172" cy="78" r="12" fill={ILLUSTRATION_FILL} />
      </g>
    </svg>
  );
}

function ZooIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M0 132 Q90 116 180 128 L220 124 L220 170 L0 170 Z" fill={ILLUSTRATION_FILL} />
      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M58 132 L58 88 C58 72 72 60 88 60 C104 60 118 72 118 88 L118 132" fill={ILLUSTRATION_FILL} />
        <circle cx="88" cy="48" r="10" fill={ILLUSTRATION_FILL} />
        <path d="M142 132 L142 104 C142 92 152 84 164 84 C176 84 186 92 186 104 L186 132" fill={ILLUSTRATION_FILL} />
        <ellipse cx="164" cy="74" rx="14" ry="10" fill={ILLUSTRATION_FILL} />
        <path d="M178 74 L196 68 L196 80 Z" fill={ILLUSTRATION_FILL} />
      </g>
    </svg>
  );
}

function CastleIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M0 132 Q90 116 180 128 L220 124 L220 170 L0 170 Z" fill={ILLUSTRATION_FILL} />
      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M52 132 L52 84 L64 68 L76 84 L76 132" fill={ILLUSTRATION_FILL} />
        <path d="M64 68 L64 60 L76 68" />
        <path d="M88 132 L88 92 L112 76 L136 92 L136 132" fill={ILLUSTRATION_FILL} />
        <path d="M112 76 L112 68 L136 76" />
        <path d="M148 132 L148 88 L160 74 L172 88 L172 132" fill={ILLUSTRATION_FILL} />
        <path d="M160 74 L160 66 L172 74" />
      </g>
    </svg>
  );
}

function CityIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M0 132 L220 132 L220 170 L0 170 Z" fill={ILLUSTRATION_FILL} />
      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinejoin="round">
        <path d="M28 132 L28 92 L52 92 L52 132" fill={ILLUSTRATION_FILL} />
        <path d="M64 132 L64 72 L96 72 L96 132" fill={ILLUSTRATION_FILL} />
        <path d="M108 132 L108 98 L132 98 L132 132" fill={ILLUSTRATION_FILL} />
        <path d="M144 132 L144 64 L176 64 L176 132" fill={ILLUSTRATION_FILL} />
        <path d="M188 132 L188 108 L208 108 L208 132" fill={ILLUSTRATION_FILL} />
      </g>
    </svg>
  );
}

function MuseumIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M0 132 L220 132 L220 170 L0 170 Z" fill={ILLUSTRATION_FILL} />
      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinejoin="round">
        <path d="M48 132 L48 96 L72 80 L96 96 L96 132" fill={ILLUSTRATION_FILL} />
        <path d="M108 132 L108 88 L172 88 L172 132" fill={ILLUSTRATION_FILL} />
        <line x1="124" y1="88" x2="124" y2="132" />
        <line x1="140" y1="88" x2="140" y2="132" />
        <line x1="156" y1="88" x2="156" y2="132" />
        <path d="M72 80 L72 72 L96 80" />
      </g>
    </svg>
  );
}

function IndoorIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M24 132 L196 132 L196 170 L24 170 Z" fill={ILLUSTRATION_FILL} />
      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M36 132 L36 72 L184 72 L184 132" fill={ILLUSTRATION_FILL} />
        <circle cx="78" cy="108" r="14" fill={ILLUSTRATION_FILL} />
        <path d="M118 132 L118 96 L154 96 L154 132" fill={ILLUSTRATION_FILL} />
        <path d="M130 96 L142 84 L154 96" />
      </g>
    </svg>
  );
}

function SportIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M0 132 Q90 120 180 128 L220 124 L220 170 L0 170 Z" fill={ILLUSTRATION_FILL} />
      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="108" cy="92" r="22" fill={ILLUSTRATION_FILL} />
        <path d="M96 84 L120 100 M120 84 L96 100" />
        <path d="M156 132 L156 88 L196 88" />
        <path d="M156 108 L196 108" />
      </g>
    </svg>
  );
}

function CinemaIllustration({ className = "" }: IllustrationProps) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M24 132 L196 132 L196 170 L24 170 Z" fill={ILLUSTRATION_FILL} />
      <g stroke={ILLUSTRATION_STROKE} strokeWidth="1.75" strokeLinejoin="round">
        <path d="M36 132 L36 68 L184 68 L184 132" fill={ILLUSTRATION_FILL} />
        <path d="M52 108 L168 108 L160 84 L60 84 Z" fill={ILLUSTRATION_FILL} />
        <path d="M72 132 L72 118 L88 118 L88 132" fill={ILLUSTRATION_FILL} />
        <path d="M104 132 L104 118 L120 118 L120 132" fill={ILLUSTRATION_FILL} />
        <path d="M136 132 L136 118 L152 118 L152 132" fill={ILLUSTRATION_FILL} />
      </g>
    </svg>
  );
}

export function ActivityTypeIllustration({ type, className = "" }: ActivityTypeIllustrationProps) {
  switch (type) {
    case "bazen":
      return <WaterIllustration className={className} />;
    case "aquapark":
      return <WaterIllustration className={className} />;
    case "koupaliste":
      return <OutdoorWaterIllustration className={className} />;
    case "les":
      return <ForestIllustration className={className} />;
    case "park":
      return <ParkIllustration className={className} />;
    case "priroda":
      return <NatureIllustration className={className} />;
    case "zoo":
      return <ZooIllustration className={className} />;
    case "hrad":
      return <CastleIllustration className={className} />;
    case "mesto":
      return <CityIllustration className={className} />;
    case "muzeum":
      return <MuseumIllustration className={className} />;
    case "indoor":
      return <IndoorIllustration className={className} />;
    case "sport":
      return <SportIllustration className={className} />;
    case "kino":
      return <CinemaIllustration className={className} />;
    default:
      return <ParkIllustration className={className} />;
  }
}
