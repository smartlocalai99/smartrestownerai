import { useState } from "react";
import Card from "@/components/owner/Card";
import SaveButton from "./SaveButton";

export default function OrderingRulesCard({ profile, onSave }) {
  const [form, setForm] = useState(() => ({
    minOrderAmount: String(profile.minOrderAmount),
    prepTimeMinutes: String(profile.prepTimeMinutes),
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setSaved(false);
    try {
      await onSave({
        minOrderAmount: Number(form.minOrderAmount) || 0,
        prepTimeMinutes: Number(form.prepTimeMinutes) || 30,
      });
      setSaved(true);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <p className="mb-3 text-sm font-medium text-ink">Ordering rules</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Minimum order amount (₹)
          <input
            type="number"
            min="0"
            value={form.minOrderAmount}
            onChange={(e) => setForm((f) => ({ ...f, minOrderAmount: e.target.value }))}
            className="input mt-1.5"
          />
        </label>

        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Default prep time (minutes)
          <input
            type="number"
            min="1"
            value={form.prepTimeMinutes}
            onChange={(e) => setForm((f) => ({ ...f, prepTimeMinutes: e.target.value }))}
            className="input mt-1.5"
          />
          <span className="mt-1 block text-[11px] font-normal normal-case text-muted">
            Used for any item without its own prep time set in the Menu tab.
          </span>
        </label>

        <SaveButton isSaving={isSaving} saved={saved} />
      </form>
    </Card>
  );
}
