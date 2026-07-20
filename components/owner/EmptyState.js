export default function EmptyState({ icon: Icon, title, message }) {
  return (
    <div className="flex flex-col items-center gap-2.5 py-10 text-center">
      {Icon ? (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-muted">
          <Icon size={22} />
        </span>
      ) : null}
      <p className="text-sm font-medium text-ink">{title}</p>
      {message ? <p className="max-w-[240px] text-xs leading-relaxed text-muted">{message}</p> : null}
    </div>
  );
}
