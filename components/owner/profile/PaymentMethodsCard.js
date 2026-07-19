import { useState } from "react";
import Card from "@/components/owner/Card";
import Switch from "@/components/owner/Switch";
import SaveButton from "./SaveButton";

export default function PaymentMethodsCard({ profile, onSave }) {
  const [methods, setMethods] = useState(() => profile.paymentMethods);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggle(id, enabled) {
    setMethods((list) => list.map((m) => (m.id === id ? { ...m, enabled } : m)));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setSaved(false);
    try {
      await onSave({ paymentMethods: methods });
      setSaved(true);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card>
      <p className="mb-3 text-sm font-medium text-ink">Payment methods</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {methods.map((method) => (
          <Switch
            key={method.id}
            checked={method.enabled}
            onChange={(v) => toggle(method.id, v)}
            label={method.label}
          />
        ))}
        <SaveButton isSaving={isSaving} saved={saved} />
      </form>
    </Card>
  );
}
