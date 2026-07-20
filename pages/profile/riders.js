import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import AppShell from "@/components/owner/AppShell";
import EmptyState from "@/components/owner/EmptyState";
import LazyImage from "@/components/owner/LazyImage";
import PageHeader from "@/components/owner/PageHeader";
import RiderFormSheet from "@/components/owner/profile/RiderFormSheet";
import { MdAdd, MdOutlineTwoWheeler } from "react-icons/md";
import { listRiders, createRider, updateRider, deleteRider } from "@/lib/ridersData.mjs";

const STATUS_TONE = { available: "text-success", busy: "text-accent", offline: "text-muted" };
const STATUS_LABEL = { available: "Available", busy: "Busy", offline: "Offline" };

export default function RidersPage() {
  const [riders, setRiders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sheet, setSheet] = useState(null);

  const refresh = useCallback(() => listRiders().then(setRiders).catch(() => {}), []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  async function handleSave(fields) {
    if (sheet.id) {
      await updateRider(sheet.id, fields);
    } else {
      await createRider(fields);
    }
    await refresh();
  }

  async function handleDelete() {
    await deleteRider(sheet.id, sheet.photoUrl);
    setSheet(null);
    await refresh();
  }

  return (
    <AppShell>
      <Head>
        <title>Riders — Mandi Kings Owner</title>
      </Head>

      <PageHeader eyebrow="Team" title="Delivery riders" backHref="/profile" />

      <div className="flex flex-col gap-3 px-5">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted">Loading riders…</p>
        ) : riders.length === 0 ? (
          <EmptyState
            icon={MdOutlineTwoWheeler}
            title="No riders added yet"
            message="Add your delivery riders so the dashboard can show who's available."
          />
        ) : (
          riders.map((rider) => (
            <button
              key={rider.id}
              onClick={() => setSheet(rider)}
              className="shadow-soft flex items-center gap-3 rounded-2xl border border-line/60 bg-surface p-3 text-left transition-colors active:bg-surface-2"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-canvas">
                {rider.photoUrl ? (
                  <LazyImage src={rider.photoUrl} alt="" sizes="48px" className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-muted">
                    {rider.name.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-medium ${rider.isActive ? "text-ink" : "text-muted"}`}>
                  {rider.name}
                </p>
                <p className="text-xs text-muted">{rider.phone || "No phone on file"}</p>
              </div>
              <span className={`text-xs font-medium ${STATUS_TONE[rider.status]}`}>
                {rider.isActive ? STATUS_LABEL[rider.status] : "Inactive"}
              </span>
            </button>
          ))
        )}

        <button
          type="button"
          onClick={() => setSheet({})}
          className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-line py-3 text-sm font-medium text-accent transition-colors active:bg-accent/5"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/12">
            <MdAdd size={16} />
          </span>
          Add rider
        </button>
      </div>

      <RiderFormSheet
        isOpen={Boolean(sheet)}
        onClose={() => setSheet(null)}
        initialRider={sheet?.id ? sheet : null}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </AppShell>
  );
}
