import { useEffect, useState } from "react";
import BottomSheet from "@/components/owner/BottomSheet";
import ImageUploadField from "@/components/owner/ImageUploadField";
import Switch from "@/components/owner/Switch";

const EMPTY = { label: "", imageUrl: null, sectionId: "", isActive: true };

export default function CategoryFormSheet({ isOpen, onClose, initialCategory, sections, onSave, onDelete }) {
  const [form, setForm] = useState(EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    if (initialCategory) {
      setForm({
        label: initialCategory.label,
        imageUrl: initialCategory.imageUrl,
        sectionId: initialCategory.sectionId ?? "",
        isActive: initialCategory.isActive,
      });
    } else {
      setForm(EMPTY);
    }
  }, [isOpen, initialCategory]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.label.trim()) {
      setError("Give this category a name.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await onSave({
        label: form.label.trim(),
        imageUrl: form.imageUrl,
        sectionId: form.sectionId || null,
        isActive: form.isActive,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Couldn't save this category.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={initialCategory ? "Edit category" : "Add category"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error ? <p className="rounded-xl bg-danger/15 px-3 py-2 text-sm text-danger">{error}</p> : null}

        <ImageUploadField
          value={form.imageUrl}
          onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
          folder="categories"
          label="Icon"
          aspectClassName="aspect-square max-w-[140px]"
        />

        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Name
          <input
            value={form.label}
            onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
            className="input mt-1.5 normal-case"
            placeholder="Mandi"
          />
        </label>

        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Jumps to menu section
          <select
            value={form.sectionId}
            onChange={(e) => setForm((f) => ({ ...f, sectionId: e.target.value }))}
            className="input mt-1.5 normal-case"
          >
            <option value="">No section (icon only)</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title}
              </option>
            ))}
          </select>
        </label>

        <div className="rounded-2xl border border-line p-3.5">
          <Switch
            checked={form.isActive}
            onChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
            label="Show on customer home screen"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-accent py-3 text-sm font-semibold text-canvas disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save category"}
        </button>

        {initialCategory ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Delete "${initialCategory.label}"?`)) onDelete();
            }}
            className="rounded-xl border border-danger/40 py-3 text-sm font-semibold text-danger"
          >
            Delete category
          </button>
        ) : null}
      </form>
    </BottomSheet>
  );
}
