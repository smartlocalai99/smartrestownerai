import { useEffect, useState } from "react";
import BottomSheet from "@/components/owner/BottomSheet";
import Switch from "@/components/owner/Switch";

export default function SectionFormSheet({ isOpen, onClose, initialSection, onSave, onDelete }) {
  const [title, setTitle] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setTitle(initialSection?.title ?? "");
    setIsActive(initialSection?.isActive ?? true);
  }, [isOpen, initialSection]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Give this section a name.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await onSave({ title: title.trim(), isActive });
      onClose();
    } catch (err) {
      setError(err.message || "Couldn't save this section.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={initialSection ? "Edit section" : "Add section"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error ? <p className="rounded-xl bg-danger/15 px-3 py-2 text-sm text-danger">{error}</p> : null}

        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Section name
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input mt-1.5 normal-case"
            placeholder="Chicken Starters"
          />
        </label>

        {initialSection ? (
          <div className="rounded-2xl border border-line p-3.5">
            <Switch checked={isActive} onChange={setIsActive} label="Visible to customers" />
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-accent py-3 text-sm font-semibold text-canvas disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save section"}
        </button>

        {initialSection ? (
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  `Delete "${initialSection.title}" and all its items? This also removes their photos.`
                )
              ) {
                onDelete();
              }
            }}
            className="rounded-xl border border-danger/40 py-3 text-sm font-semibold text-danger"
          >
            Delete section
          </button>
        ) : null}
      </form>
    </BottomSheet>
  );
}
