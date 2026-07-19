import { useEffect, useState } from "react";
import BottomSheet from "@/components/owner/BottomSheet";
import ImageUploadField from "@/components/owner/ImageUploadField";
import Switch from "@/components/owner/Switch";

const EMPTY = {
  title: "",
  description: "",
  price: "",
  oldPrice: "",
  imageUrl: null,
  isVeg: true,
  isBestseller: false,
  isAvailable: true,
  prepTimeMinutes: "",
};

export default function ItemFormSheet({ isOpen, onClose, initialItem, onSave, onDelete }) {
  const [form, setForm] = useState(EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    if (initialItem) {
      setForm({
        title: initialItem.title,
        description: initialItem.description || "",
        price: String(initialItem.price),
        oldPrice: initialItem.oldPrice != null ? String(initialItem.oldPrice) : "",
        imageUrl: initialItem.imageUrl,
        isVeg: initialItem.isVeg,
        isBestseller: initialItem.isBestseller,
        isAvailable: initialItem.isAvailable,
        prepTimeMinutes: initialItem.prepTimeMinutes != null ? String(initialItem.prepTimeMinutes) : "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [isOpen, initialItem]);

  async function handleSubmit(event) {
    event.preventDefault();
    const price = Number(form.price);
    if (!form.title.trim() || Number.isNaN(price) || price < 0) {
      setError("Enter a title and a valid price.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await onSave({
        title: form.title.trim(),
        description: form.description.trim(),
        price,
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        imageUrl: form.imageUrl,
        isVeg: form.isVeg,
        isBestseller: form.isBestseller,
        isAvailable: form.isAvailable,
        prepTimeMinutes: form.prepTimeMinutes ? Number(form.prepTimeMinutes) : null,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Couldn't save this item.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={initialItem ? "Edit item" : "Add item"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error ? <p className="rounded-xl bg-danger/15 px-3 py-2 text-sm text-danger">{error}</p> : null}

        <ImageUploadField
          value={form.imageUrl}
          onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
          folder="menu"
          aspectClassName="aspect-[4/3]"
        />

        <Field label="Name">
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="input"
            placeholder="Chicken 65"
          />
        </Field>

        <Field label="Description">
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="input min-h-[72px] resize-none"
            placeholder="Short description shown to customers"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (₹)">
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="input"
            />
          </Field>
          <Field label="Strike price (₹)">
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.oldPrice}
              onChange={(e) => setForm((f) => ({ ...f, oldPrice: e.target.value }))}
              className="input"
              placeholder="Optional"
            />
          </Field>
        </div>

        <Field label="Prep time (minutes)">
          <input
            type="number"
            min="1"
            value={form.prepTimeMinutes}
            onChange={(e) => setForm((f) => ({ ...f, prepTimeMinutes: e.target.value }))}
            className="input"
            placeholder="Uses restaurant default if empty"
          />
        </Field>

        <div className="flex flex-col gap-3 rounded-2xl border border-line p-3.5">
          <Switch
            checked={form.isVeg}
            onChange={(v) => setForm((f) => ({ ...f, isVeg: v }))}
            label="Vegetarian"
          />
          <Switch
            checked={form.isBestseller}
            onChange={(v) => setForm((f) => ({ ...f, isBestseller: v }))}
            label="Mark as bestseller"
          />
          <Switch
            checked={form.isAvailable}
            onChange={(v) => setForm((f) => ({ ...f, isAvailable: v }))}
            label="Available today"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-accent py-3 text-sm font-semibold text-canvas disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save item"}
        </button>

        {initialItem ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Remove "${initialItem.title}" from the menu?`)) {
                onDelete();
              }
            }}
            className="rounded-xl border border-danger/40 py-3 text-sm font-semibold text-danger"
          >
            Delete item
          </button>
        ) : null}
      </form>
    </BottomSheet>
  );
}

function Field({ label, children }) {
  return (
    <label className="block text-xs font-medium uppercase tracking-wide text-muted">
      {label}
      <div className="mt-1.5 normal-case">{children}</div>
    </label>
  );
}
