import { useState } from "react";
import Card from "@/components/owner/Card";
import Switch from "@/components/owner/Switch";
import SaveButton from "./SaveButton";

export default function DeliveryPricingCard({ profile, onSave }) {
  const [form, setForm] = useState(() => ({
    deliveryBaseKm: String(profile.deliveryBaseKm),
    deliveryBaseFee: String(profile.deliveryBaseFee),
    deliveryPerKmFee: String(profile.deliveryPerKmFee),
    freeDeliveryEnabled: profile.freeDeliveryMinAmount != null,
    freeDeliveryMinAmount: profile.freeDeliveryMinAmount != null ? String(profile.freeDeliveryMinAmount) : "",
  }));
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setSaved(false);
    try {
      await onSave({
        deliveryBaseKm: Number(form.deliveryBaseKm) || 0,
        deliveryBaseFee: Number(form.deliveryBaseFee) || 0,
        deliveryPerKmFee: Number(form.deliveryPerKmFee) || 0,
        freeDeliveryMinAmount: form.freeDeliveryEnabled ? Number(form.freeDeliveryMinAmount) || 0 : null,
      });
      setSaved(true);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <p className="mb-1 text-sm font-medium text-ink">Delivery pricing</p>
      <p className="mb-3 text-xs text-muted">
        Distance is measured from your restaurant address to the customer&apos;s address.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Included distance (km)
            <input
              type="number"
              min="0"
              step="0.1"
              value={form.deliveryBaseKm}
              onChange={(e) => setForm((f) => ({ ...f, deliveryBaseKm: e.target.value }))}
              className="input mt-1.5"
            />
          </label>
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            Base fee (₹)
            <input
              type="number"
              min="0"
              value={form.deliveryBaseFee}
              onChange={(e) => setForm((f) => ({ ...f, deliveryBaseFee: e.target.value }))}
              className="input mt-1.5"
            />
          </label>
        </div>

        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Fee per extra km beyond that (₹)
          <input
            type="number"
            min="0"
            value={form.deliveryPerKmFee}
            onChange={(e) => setForm((f) => ({ ...f, deliveryPerKmFee: e.target.value }))}
            className="input mt-1.5"
          />
        </label>

        <div className="rounded-2xl border border-line p-3.5">
          <Switch
            checked={form.freeDeliveryEnabled}
            onChange={(v) => setForm((f) => ({ ...f, freeDeliveryEnabled: v }))}
            label="Free delivery above an order amount"
          />
          {form.freeDeliveryEnabled ? (
            <input
              type="number"
              min="0"
              value={form.freeDeliveryMinAmount}
              onChange={(e) => setForm((f) => ({ ...f, freeDeliveryMinAmount: e.target.value }))}
              className="input mt-3"
              placeholder="e.g. 499"
            />
          ) : null}
        </div>

        <SaveButton isSaving={isSaving} saved={saved} />
      </form>
    </Card>
  );
}
