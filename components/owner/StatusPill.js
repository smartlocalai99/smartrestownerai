const TONES = {
  success: "bg-success/15 text-success",
  accent: "bg-accent/15 text-accent",
  danger: "bg-danger/15 text-danger",
  muted: "bg-muted/15 text-muted",
};

export default function StatusPill({ tone = "muted", dot = true, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {dot ? <span className="h-1.5 w-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
