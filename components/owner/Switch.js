export default function Switch({ checked, onChange, disabled, label }) {
  return (
    <label className={`flex items-center justify-between gap-3 ${disabled ? "opacity-50" : ""}`}>
      {label ? <span className="text-sm text-ink">{label}</span> : null}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full ring-1 ring-inset transition-colors duration-150 ${
          checked ? "bg-accent ring-accent" : "bg-surface-2 ring-line"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-150 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
