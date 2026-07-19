import { useState } from "react";
import Card from "@/components/owner/Card";
import Switch from "@/components/owner/Switch";
import SaveButton from "./SaveButton";

export default function HoursCard({ profile, onSave }) {
  const [form, setForm] = useState(() => ({
    isOpen: profile.isOpen,
    busyMode: profile.busyMode,
    openingTime: profile.openingTime?.slice(0, 5) ?? "10:00",
    closingTime: profile.closingTime?.slice(0, 5) ?? "23:00",
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setSaved(false);
    try {
      await onSave(form);
      setSaved(true);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <p className="mb-3 text-sm font-medium text-ink">Hours &amp; status</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <Switch
          checked={form.isOpen}
          onChange={(v) => setForm((f) => ({ ...f, isOpen: v }))}
          label="Accepting orders"
        />
        <Switch
          checked={form.busyMode}
          onChange={(v) => setForm((f) => ({ ...f, busyMode: v }))}
          label="Temporarily busy (pauses new orders)"
        />

        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Opens
            <input
              type="time"
              value={form.openingTime}
              onChange={(e) => setForm((f) => ({ ...f, openingTime: e.target.value }))}
              className="input mt-1.5"
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Closes
            <input
              type="time"
              value={form.closingTime}
              onChange={(e) => setForm((f) => ({ ...f, closingTime: e.target.value }))}
              className="input mt-1.5"
            />
          </label>
        </div>

        <SaveButton isSaving={isSaving} saved={saved} />
      </form>
    </Card>
  );
}
