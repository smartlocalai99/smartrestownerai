const OPTIONS = [
  { id: "today", label: "Today" },
  { id: "week", label: "This week" },
];

export default function RangeToggle({ value, onChange }) {
  return (
    <div className="shadow-soft inline-flex rounded-full border border-line/60 bg-surface p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            value === option.id ? "bg-accent text-canvas shadow-sm" : "text-muted"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
