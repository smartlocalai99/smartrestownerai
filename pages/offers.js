import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import AppShell from "@/components/owner/AppShell";
import EmptyState from "@/components/owner/EmptyState";
import PageHeader from "@/components/owner/PageHeader";
import OfferCard from "@/components/owner/offers/OfferCard";
import OfferFormSheet from "@/components/owner/offers/OfferFormSheet";
import { MdAdd, MdOutlineLocalOffer } from "react-icons/md";
import { listOffers, createOffer, updateOffer, deleteOffer } from "@/lib/offersData.mjs";
import { swapDisplayOrder } from "@/lib/reorder.mjs";

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sheet, setSheet] = useState(null);

  const refresh = useCallback(() => listOffers().then(setOffers).catch(() => {}), []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  async function handleSave(fields) {
    if (sheet.id) {
      await updateOffer(sheet.id, fields);
    } else {
      await createOffer(fields, offers.length);
    }
    await refresh();
  }

  async function handleDelete() {
    await deleteOffer(sheet.id, sheet.imageUrl);
    setSheet(null);
    await refresh();
  }

  async function handleMove(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= offers.length) return;
    await swapDisplayOrder("offers", offers[index], offers[target]);
    await refresh();
  }

  return (
    <AppShell>
      <Head>
        <title>Offers — Mandi Kings Owner</title>
      </Head>

      <PageHeader eyebrow="Manage" title="Offers" />

      <div className="flex flex-col gap-3 px-5">
        <p className="text-sm leading-relaxed text-muted">
          Live offers show up in the customer app&apos;s top banner automatically, in this order.
        </p>

        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted">Loading offers…</p>
        ) : offers.length === 0 ? (
          <EmptyState
            icon={MdOutlineLocalOffer}
            title="No offers yet"
            message="Add one below and it shows up in the customer app immediately."
          />
        ) : (
          offers.map((offer, index) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              isFirst={index === 0}
              isLast={index === offers.length - 1}
              onOpen={() => setSheet(offer)}
              onMoveUp={() => handleMove(index, -1)}
              onMoveDown={() => handleMove(index, 1)}
            />
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
          Add offer
        </button>
      </div>

      <OfferFormSheet
        isOpen={Boolean(sheet)}
        onClose={() => setSheet(null)}
        initialOffer={sheet?.id ? sheet : null}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </AppShell>
  );
}
