import {
  Activity,
  Angry,
  ArrowRight,
  Baby,
  Building2,
  Castle,
  ChevronLeft,
  Clock,
  Cloud,
  CloudRain,
  CloudSun,
  Coins,
  Compass,
  Dumbbell,
  ExternalLink,
  Film,
  Heart,
  Home,
  Landmark,
  Leaf,
  ListOrdered,
  MapPin,
  Moon,
  Navigation,
  PartyPopper,
  PawPrint,
  RefreshCw,
  Scale,
  Share,
  Smile,
  Snowflake,
  Sparkles,
  Sun,
  Thermometer,
  TreePine,
  Trees,
  User,
  Users,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type {
  ActivityType,
  ChildMood,
  ParentEnergy,
  RecommendationType,
  WeatherCondition,
} from "@/types";

export const ACTIVITY_ICONS: Record<ActivityType, LucideIcon> = {
  bazen: Waves,
  les: TreePine,
  park: Trees,
  zoo: PawPrint,
  muzeum: Landmark,
  hrad: Castle,
  aquapark: Waves,
  koupaliste: Waves,
  indoor: Home,
  kino: Film,
  sport: Dumbbell,
  mesto: Building2,
  priroda: Leaf,
};

export const ENERGY_ICONS: Record<ParentEnergy, LucideIcon> = {
  tired: Moon,
  ok: Smile,
  energetic: Zap,
};

export const MOOD_ICONS: Record<ChildMood, LucideIcon> = {
  calm: Heart,
  active: Activity,
  cranky: Angry,
};

export const WEATHER_ICONS: Record<WeatherCondition, LucideIcon> = {
  sunny: Sun,
  cloudy: Cloud,
  rain: CloudRain,
  snow: Snowflake,
};

export const RECOMMENDATION_ICONS: Record<RecommendationType, LucideIcon> = {
  single: Sparkles,
  overlap: Users,
  sequential: ListOrdered,
  compromise: Scale,
  rotation: RefreshCw,
};

type IconProps = {
  icon: LucideIcon;
  size?: number;
  className?: string;
  strokeWidth?: number;
};

export function Icon({ icon: LucideIconComponent, size = 20, className = "", strokeWidth = 2 }: IconProps) {
  return (
    <LucideIconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    />
  );
}

export {
  Activity,
  Angry,
  ArrowRight,
  Baby,
  Building2,
  Castle,
  ChevronLeft,
  Clock,
  Cloud,
  CloudRain,
  CloudSun,
  Coins,
  Compass,
  Dumbbell,
  ExternalLink,
  Film,
  Heart,
  Home,
  Landmark,
  Leaf,
  ListOrdered,
  MapPin,
  Moon,
  Navigation,
  PartyPopper,
  PawPrint,
  RefreshCw,
  Scale,
  Share,
  Smile,
  Snowflake,
  Sparkles,
  Sun,
  Thermometer,
  TreePine,
  Trees,
  User,
  Users,
  Waves,
  Zap,
};
