import Link from "next/link";
import LazyImage from "@/components/owner/LazyImage";
import StatusPill from "@/components/owner/StatusPill";

const STATUS_TONE = { available: "success", busy: "accent", offline: "muted" };
const STATUS_LABEL = { available: "Available", busy: "Busy", offline: "Offline" };

export default function RidersStrip({ riders }) {
  const activeRiders = riders.filter((rider) => rider.isActive);

  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Riders</p>
        <Link href="/profile/riders" className="text-xs text-muted underline underline-offset-2">
          Manage
        </Link>
      </div>

      {activeRiders.length === 0 ? (
        <p className="text-sm text-muted">No riders added yet.</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {activeRiders.map((rider) => (
            <li key={rider.id} className="flex items-center gap-3">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-canvas">
                {rider.photoUrl ? (
                  <LazyImage src={rider.photoUrl} alt="" sizes="36px" className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted">
                    {rider.name.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="flex-1 truncate text-sm text-ink">{rider.name}</span>
              <StatusPill tone={STATUS_TONE[rider.status]}>{STATUS_LABEL[rider.status]}</StatusPill>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
