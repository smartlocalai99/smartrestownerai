const TONE_CLASSES = {
  ink: "text-ink",
  success: "text-success",
  danger: "text-danger",
  accent: "text-accent",
};

export default function StatTile({ label, value, tone = "ink" }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-3.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${TONE_CLASSES[tone]}`}>{value}</p>
    </div>
  );
}
