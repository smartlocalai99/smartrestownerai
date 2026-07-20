const TONE_TEXT = {
  ink: "text-ink",
  success: "text-success",
  danger: "text-danger",
  accent: "text-accent",
};

const TONE_CHIP = {
  ink: "bg-ink/8 text-ink",
  success: "bg-success/12 text-success",
  danger: "bg-danger/12 text-danger",
  accent: "bg-accent/12 text-accent",
};

export default function StatTile({ label, value, tone = "ink", icon: Icon }) {
  return (
    <div className="shadow-soft flex items-start justify-between gap-2 rounded-2xl border border-line/60 bg-surface p-3.5">
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className={`mt-1 text-xl font-semibold tabular ${TONE_TEXT[tone]}`}>{value}</p>
      </div>
      {Icon ? (
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${TONE_CHIP[tone]}`}>
          <Icon size={16} />
        </span>
      ) : null}
    </div>
  );
}
