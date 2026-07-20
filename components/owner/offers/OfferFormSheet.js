import { useEffect, useMemo, useState } from "react";
import { MdAdd, MdOutlineClose, MdOutlineSearch, MdCheckCircle, MdOutlineCircle } from "react-icons/md";
import BottomSheet from "@/components/owner/BottomSheet";
import ImageUploadField from "@/components/owner/ImageUploadField";
import LazyImage from "@/components/owner/LazyImage";
import Switch from "@/components/owner/Switch";
import { listMenu } from "@/lib/menuData.mjs";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const EMPTY = { title: "", subtitle: "", imageUrl: null, offerPrice: "", isActive: true, itemIds: [] };

function ItemPickerSheet({ isOpen, onClose, sections, selectedIds, onToggle }) {
  const [query, setQuery] = useState("");

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((section) => ({ ...section, items: section.items.filter((item) => item.title.toLowerCase().includes(q)) }))
      .filter((section) => section.items.length > 0);
  }, [sections, query]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={`Select items (${selectedIds.length})`}>
      <div className="relative mb-3">
        <MdOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search menu items"
          className="input pl-9"
        />
      </div>

      <div className="max-h-[55vh] overflow-y-auto">
        {filteredSections.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No items match.</p>
        ) : (
          filteredSections.map((section) => (
            <div key={section.id} className="mb-3">
              <p className="mb-1 px-1 text-xs font-medium uppercase tracking-wide text-muted">{section.title}</p>
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onToggle(item)}
                      className={`flex items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors ${
                        isSelected ? "bg-accent/8" : "active:bg-surface-2"
                      }`}
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-canvas">
                        {item.imageUrl ? <LazyImage src={item.imageUrl} alt="" sizes="40px" className="object-cover" /> : null}
                      </div>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ink">{item.title}</span>
                        <span className="block text-xs text-muted">₹{item.price}</span>
                      </span>
                      {isSelected ? (
                        <MdCheckCircle className="shrink-0 text-accent" size={20} />
                      ) : (
                        <MdOutlineCircle className="shrink-0 text-line" size={20} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-2 w-full rounded-xl bg-accent py-3 text-sm font-semibold text-canvas"
      >
        Done
      </button>
    </BottomSheet>
  );
}

export default function OfferFormSheet({ isOpen, onClose, initialOffer, onSave, onDelete }) {
  const [form, setForm] = useState(EMPTY);
  const [selectedItems, setSelectedItems] = useState([]);
  const [sections, setSections] = useState([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    listMenu().then(setSections).catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    if (initialOffer) {
      setForm({
        title: initialOffer.title,
        subtitle: initialOffer.subtitle || "",
        imageUrl: initialOffer.imageUrl,
        offerPrice: initialOffer.salePrice != null ? String(initialOffer.salePrice) : "",
        isActive: initialOffer.isActive,
        itemIds: initialOffer.items.map((item) => item.id),
      });
      setSelectedItems(initialOffer.items);
    } else {
      setForm(EMPTY);
      setSelectedItems([]);
    }
  }, [isOpen, initialOffer]);

  const regularPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

  function toggleItem(item) {
    const isSelected = selectedItems.some((i) => i.id === item.id);
    const nextSelectedItems = isSelected
      ? selectedItems.filter((i) => i.id !== item.id)
      : [...selectedItems, item];

    setSelectedItems(nextSelectedItems);
    setForm((f) => ({
      ...f,
      itemIds: nextSelectedItems.map((i) => i.id),
      title: f.title.trim() ? f.title : nextSelectedItems.map((i) => i.title).slice(0, 2).join(" + "),
    }));
  }

  function removeItem(itemId) {
    setForm((f) => ({ ...f, itemIds: f.itemIds.filter((id) => id !== itemId) }));
    setSelectedItems((current) => current.filter((i) => i.id !== itemId));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (form.itemIds.length === 0) {
      setError("Select at least one menu item for this offer.");
      return;
    }
    if (!form.title.trim()) {
      setError("Give this offer a title.");
      return;
    }
    if (!form.offerPrice) {
      setError("Set the offer price.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await onSave({
        title: form.title.trim(),
        subtitle: form.subtitle.trim(),
        imageUrl: form.imageUrl,
        strikePrice: regularPrice > 0 ? regularPrice : null,
        salePrice: Number(form.offerPrice),
        isActive: form.isActive,
        itemIds: form.itemIds,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Couldn't save this offer.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <BottomSheet isOpen={isOpen} onClose={onClose} title={initialOffer ? "Edit offer" : "Add offer"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error ? <p className="rounded-xl bg-danger/15 px-3 py-2 text-sm text-danger">{error}</p> : null}

          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted">Items in this offer</p>
            {selectedItems.length > 0 ? (
              <div className="mb-2 flex flex-col gap-1.5">
                {selectedItems.map((item) => (
                  <div key={item.id} className="shadow-soft flex items-center gap-2.5 rounded-xl border border-line/60 bg-surface p-2">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-canvas">
                      {item.imageUrl ? <LazyImage src={item.imageUrl} alt="" sizes="36px" className="object-cover" /> : null}
                    </div>
                    <span className="min-w-0 flex-1 truncate text-sm text-ink">{item.title}</span>
                    <span className="shrink-0 text-sm tabular text-muted">₹{item.price}</span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted active:bg-surface-2"
                      aria-label={`Remove ${item.title}`}
                    >
                      <MdOutlineClose size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line py-2.5 text-sm font-medium text-accent transition-colors active:bg-accent/5"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/12">
                <MdAdd size={14} />
              </span>
              {selectedItems.length > 0 ? "Change items" : "Select items"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-canvas p-3">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">Regular price</p>
              <p className="mt-1 text-lg font-semibold tabular text-muted line-through">
                {regularPrice > 0 ? currency.format(regularPrice) : "—"}
              </p>
            </div>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">Offer price (₹)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.offerPrice}
                onChange={(e) => setForm((f) => ({ ...f, offerPrice: e.target.value }))}
                className="input mt-1.5"
                placeholder="99"
              />
            </label>
          </div>

          <ImageUploadField
            value={form.imageUrl}
            onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
            folder="offers"
            label="Banner photo"
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

      <ItemPickerSheet
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        sections={sections}
        selectedIds={form.itemIds}
        onToggle={toggleItem}
      />
    </>
  );
}
