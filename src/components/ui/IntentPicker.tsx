import { OptionButton } from "@/components/ui/OptionButton";
import { INTENT_ICONS, INTENT_OPTIONS, type IntentType } from "@/lib/intents";
import { Icon } from "@/lib/icons";

type IntentPickerProps = {
  label: string;
  hint?: string;
  intents: IntentType[];
  max: number;
  onChange: (intents: IntentType[]) => void;
  columns?: 2 | 3;
};

export function IntentPicker({
  label,
  hint,
  intents,
  max,
  onChange,
  columns = 2,
}: IntentPickerProps) {
  function toggle(intent: IntentType) {
    if (intents.includes(intent)) {
      onChange(intents.filter((item) => item !== intent));
      return;
    }
    if (intents.length >= max) {
      return;
    }
    onChange([...intents, intent]);
  }

  return (
    <div>
      <p className="mb-1 text-[15px] font-medium text-slate">{label}</p>
      {hint && <p className="mb-3 text-[13px] text-steel">{hint}</p>}
      {!hint && <div className="mb-3" />}
      <div className={`grid gap-2.5 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {INTENT_OPTIONS.map((option) => (
          <OptionButton
            key={option.value}
            selected={intents.includes(option.value)}
            onClick={() => toggle(option.value)}
            icon={<Icon icon={INTENT_ICONS[option.value]} size={18} />}
          >
            {option.label}
          </OptionButton>
        ))}
      </div>
      <p className="mt-2 text-[13px] text-steel">
        Vybráno {intents.length}/{max}
      </p>
    </div>
  );
}
