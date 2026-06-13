type OptionButtonProps = {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

export function OptionButton({ selected, onClick, children, className = "" }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors ${
        selected
          ? "border-sky-600 bg-sky-50 text-sky-900"
          : "border-gray-200 bg-white text-gray-800 hover:border-sky-300"
      } ${className}`}
    >
      {children}
    </button>
  );
}
