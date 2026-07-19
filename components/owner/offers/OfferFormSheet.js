import { useEffect, useState } from "react";
import BottomSheet from "@/components/owner/BottomSheet";
import ImageUploadField from "@/components/owner/ImageUploadField";
import Switch from "@/components/owner/Switch";

const EMPTY = { title: "", subtitle: "", imageUrl: null, strikePrice: "", salePrice: "", isActive: true };

export default function OfferFormSheet({ isOpen, onClose, initialOffer, onSave, onDelete }) {
  const [form, setForm] = useState(EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    if (initialOffer) {
      setForm({
        title: initialOffer.title,
        subtitle: initialOffer.subtitle || "",
        imageUrl: initialOffer.imageUrl,
        strikePrice: initialOffer.strikePrice != null ? String(initialOffer.strikePrice) : "",
        salePrice: initialOffer.salePrice != null ? String(initialOffer.salePrice) : "",
        isActive: initialOffer.isActive,
      });
    } else {
      setForm(EMPTY);
    }
  }, [isOpen, initialOffer]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim()) {
      setError("Give this offer a title.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await onSave({
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        imageUrl: form.imageUrl,
        strikePrice: form.strikePrice ? Number(form.strikePrice) : null,
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        isActive: form.isActive,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Couldn't save this offer.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={initialOffer ? "Edit offer" : "Add offer"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error ? <p className="rounded-xl bg-danger/15 px-3 py-2 text-sm text-danger">{error}</p> : null}

        <ImageUploadField
          value={form.imageUrl}
          onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
          folder="offers"
          aspectClassName="aspect-[16/9]"
        />

        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Title
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="input mt-1.5 normal-case"
            placeholder="Get Your Mini Mandi"
          />
        </label>

        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Subtitle
          <input
            value={form.subtitle}
            onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            className="input mt-1.5 normal-case"
            placeholder="Limited-time offer"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Strike price (₹)
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.strikePrice}
              onChange={(e) => setForm((f) => ({ ...f, strikePrice: e.target.value }))}
              className="input mt-1.5"
              placeholder="129"
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Sale price (₹)
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.salePrice}
              onChange={(e) => setForm((f) => ({ ...f, salePrice: e.target.value }))}
              className="input mt-1.5"
              placeholder="99"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-line p-3.5">
          <Switch
            checked={form.isActive}
            onChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
            label="Live in customer app"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-accent py-3 text-sm font-semibold text-canvas disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save offer"}
        </button>

        {initialOffer ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete "${initialOffer.title}"?`)) onDelete();
            }}
            className="rounded-xl border border-danger/40 py-3 text-sm font-semibold text-danger"
          >
            Delete offer
          </button>
        ) : null}
      </form>
    </BottomSheet>
  );
}
