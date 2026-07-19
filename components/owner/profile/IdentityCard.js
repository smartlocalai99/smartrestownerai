import { useState } from "react";
import Card from "@/components/owner/Card";
import ImageUploadField from "@/components/owner/ImageUploadField";
import SaveButton from "./SaveButton";

export default function IdentityCard({ profile, onSave }) {
  const [form, setForm] = useState(() => ({
    name: profile.name,
    phone: profile.phone,
    addressLine: profile.addressLine,
    description: profile.description,
    logoUrl: profile.logoUrl,
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
      <p className="mb-3 text-sm font-medium text-ink">Restaurant details</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <ImageUploadField
          value={form.logoUrl}
          onChange={(url) => setForm((f) => ({ ...f, logoUrl: url }))}
          folder="profile"
          label="Logo"
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
            placeholder="10-digit number"
          />
        </label>

        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Address
          <textarea
            value={form.addressLine}
            onChange={(e) => setForm((f) => ({ ...f, addressLine: e.target.value }))}
            className="input mt-1.5 min-h-[64px] resize-none normal-case"
          />
        </label>

        <SaveButton isSaving={isSaving} saved={saved} />
      </form>
    </Card>
  );
}
