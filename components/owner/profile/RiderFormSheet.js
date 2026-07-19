import { useEffect, useState } from "react";
import BottomSheet from "@/components/owner/BottomSheet";
import ImageUploadField from "@/components/owner/ImageUploadField";
import Switch from "@/components/owner/Switch";

const EMPTY = { name: "", phone: "", vehicleNumber: "", photoUrl: null, status: "available", isActive: true };
const STATUSES = [
  { id: "available", label: "Available" },
  { id: "busy", label: "Busy" },
  { id: "offline", label: "Offline" },
];

export default function RiderFormSheet({ isOpen, onClose, initialRider, onSave, onDelete }) {
  const [form, setForm] = useState(EMPTY);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setForm(
      initialRider
        ? {
            name: initialRider.name,
            phone: initialRider.phone,
            vehicleNumber: initialRider.vehicleNumber,
            photoUrl: initialRider.photoUrl,
            status: initialRider.status,
            isActive: initialRider.isActive,
          }
        : EMPTY
    );
  }, [isOpen, initialRider]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Enter the rider's name.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.message || "Couldn't save this rider.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={initialRider ? "Edit rider" : "Add rider"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error ? <p className="rounded-xl bg-danger/15 px-3 py-2 text-sm text-danger">{error}</p> : null}

        <ImageUploadField
          value={form.photoUrl}
          onChange={(url) => setForm((f) => ({ ...f, photoUrl: url }))}
          folder="riders"
          aspectClassName="aspect-square max-w-[7rem]"
        />

        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Name
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="input mt-1.5 normal-case"
          />
        </label>

        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Phone
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="input mt-1.5 normal-case"
          />
        </label>

        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Vehicle number
          <input
            value={form.vehicleNumber}
            onChange={(e) => setForm((f) => ({ ...f, vehicleNumber: e.target.value }))}
            className="input mt-1.5 normal-case"
          />
        </label>

        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted">Status</p>
          <div className="flex gap-2">
            {STATUSES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setForm((f) => ({ ...f, status: s.id }))}
                className={`flex-1 rounded-xl border py-2 text-sm font-medium ${
                  form.status === s.id ? "border-accent bg-accent/15 text-accent" : "border-line text-muted"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {initialRider ? (
          <div className="rounded-2xl border border-line p-3.5">
            <Switch
              checked={form.isActive}
              onChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
              label="Currently employed"
            />
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-accent py-3 text-sm font-semibold text-canvas disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save rider"}
        </button>

        {initialRider ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Remove ${initialRider.name}?`)) onDelete();
            }}
            className="rounded-xl border border-danger/40 py-3 text-sm font-semibold text-danger"
          >
            Remove rider
          </button>
        ) : null}
      </form>
    </BottomSheet>
  );
}
