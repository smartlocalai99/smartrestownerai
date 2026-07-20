import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import AppShell from "@/components/owner/AppShell";
import EmptyState from "@/components/owner/EmptyState";
import PageHeader from "@/components/owner/PageHeader";
import CounterFormSheet from "@/components/owner/profile/CounterFormSheet";
import { MdAdd, MdChevronRight, MdOutlinePointOfSale } from "react-icons/md";
import {
  listBillingCounters,
  createBillingCounter,
  updateBillingCounter,
  resetBillingCounterPin,
  deleteBillingCounter,
} from "@/lib/billingCountersData.mjs";

export default function BillingCountersPage() {
  const [counters, setCounters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sheet, setSheet] = useState(null);

  const refresh = useCallback(() => listBillingCounters().then(setCounters).catch(() => {}), []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  async function handleSave(fields) {
    if (sheet.id) {
      await updateBillingCounter(sheet.id, { label: fields.label, username: fields.username, isActive: fields.isActive });
    } else {
      await createBillingCounter(fields.label, fields.username, fields.pin);
    }
    await refresh();
  }

  async function handleResetPin(pin) {
    await resetBillingCounterPin(sheet.id, pin);
  }

  async function handleDelete() {
    await deleteBillingCounter(sheet.id);
    setSheet(null);
    await refresh();
  }

  return (
    <AppShell>
      <Head>
        <title>Billing counters — Mandi Kings Owner</title>
      </Head>

      <PageHeader eyebrow="Team" title="Billing counter logins" backHref="/profile" />

      <div className="flex flex-col gap-3 px-5">
        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted">Loading…</p>
        ) : counters.length === 0 ? (
          <EmptyState
            icon={MdOutlinePointOfSale}
            title="No billing counters yet"
            message="Add a login for each front-of-house counter so staff can bill orders."
          />
        ) : (
          counters.map((counter) => (
            <button
              key={counter.id}
              onClick={() => setSheet(counter)}
              className="shadow-soft flex items-center gap-3 rounded-2xl border border-line/60 bg-surface p-3.5 text-left transition-colors active:bg-surface-2"
            >
              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-medium ${counter.isActive ? "text-ink" : "text-muted"}`}>
                  {counter.label}
                </p>
                <p className="font-mono text-xs text-muted">@{counter.username}</p>
              </div>
              {!counter.isActive ? (
                <span className="rounded-full bg-danger/10 px-2 py-0.5 text-xs font-medium text-danger">
                  Disabled
                </span>
              ) : null}
              <MdChevronRight className="shrink-0 text-muted" size={20} />
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
          Add billing counter
        </button>
      </div>

      <CounterFormSheet
        isOpen={Boolean(sheet)}
        onClose={() => setSheet(null)}
        initialCounter={sheet?.id ? sheet : null}
        onSave={handleSave}
        onResetPin={handleResetPin}
        onDelete={handleDelete}
      />
    </AppShell>
  );
}
