import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { MdOutlineLocalOffer, MdOutlineSend } from "react-icons/md";
import AppShell from "@/components/owner/AppShell";
import PageHeader from "@/components/owner/PageHeader";
import Card from "@/components/owner/Card";
import { listOffers } from "@/lib/offersData.mjs";
import { sendBroadcastNotification } from "@/lib/notificationsData.mjs";

export default function NotificationsPage() {
  const [offers, setOffers] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    listOffers().then(setOffers).catch(() => {});
  }, []);

  const selectedOffer = useMemo(
    () => offers.find((offer) => offer.id === selectedOfferId) ?? null,
    [offers, selectedOfferId]
  );

  const handlePickOffer = (offer) => {
    if (selectedOfferId === offer.id) {
      setSelectedOfferId(null);
      return;
    }
    setSelectedOfferId(offer.id);
    setTitle(offer.title);
    setBody(offer.subtitle || `${offer.title} — now on the menu. Tap to order.`);
  };

  const handleSend = async () => {
    if (!title.trim() || !body.trim() || isSending) return;
    setIsSending(true);
    setError("");
    setResult(null);
    try {
      const outcome = await sendBroadcastNotification({
        title,
        body,
        offerId: selectedOffer?.id ?? null,
      });
      setResult(outcome);
      setTitle("");
      setBody("");
      setSelectedOfferId(null);
    } catch {
      setError("Could not send this notification. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AppShell>
      <Head>
        <title>Notifications — Mandi Kings Owner</title>
      </Head>

      <PageHeader eyebrow="Engage" title="Notifications" backHref="/dashboard" />

      <div className="flex flex-col gap-4 px-5">
        <Card className="gap-3">
          <p className="text-xs font-medium text-muted">
            Sending to every registered customer device
          </p>

          {offers.length > 0 ? (
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted">Quick-fill from an offer</p>
              <div className="flex flex-wrap gap-1.5">
                {offers.map((offer) => (
                  <button
                    key={offer.id}
                    type="button"
                    onClick={() => handlePickOffer(offer)}
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                      selectedOfferId === offer.id
                        ? "border-ink bg-ink text-surface"
                        : "border-line text-muted"
                    }`}
                  >
                    <MdOutlineLocalOffer size={13} />
                    {offer.title}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="50% off Mandi this weekend"
              maxLength={60}
              className="rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm text-ink outline-none focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Message</span>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Tell customers what's new…"
              rows={3}
              maxLength={160}
              className="resize-none rounded-xl border border-line bg-canvas px-3 py-2.5 text-sm text-ink outline-none focus:border-accent"
            />
          </label>

          <button
            type="button"
            onClick={handleSend}
            disabled={!title.trim() || !body.trim() || isSending}
            className="flex items-center justify-center gap-2 rounded-2xl bg-accent py-3 text-sm font-medium text-surface transition-opacity disabled:opacity-40"
          >
            <MdOutlineSend size={16} />
            {isSending ? "Sending…" : "Send to all customers"}
          </button>

          {error ? <p className="text-center text-xs text-danger">{error}</p> : null}
          {result ? (
            <p className="text-center text-xs text-success">
              Accepted by Expo: {result.acceptedCount} of {result.recipientCount} registered device
              {result.recipientCount === 1 ? "" : "s"}
              {result.rejectedCount ? ` · ${result.rejectedCount} rejected` : ""}
            </p>
          ) : null}
        </Card>
      </div>
    </AppShell>
  );
}
