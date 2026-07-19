import { useEffect, useState } from "react";
import BottomSheet from "@/components/owner/BottomSheet";
import Switch from "@/components/owner/Switch";

export default function CounterFormSheet({ isOpen, onClose, initialCounter, onSave, onResetPin, onDelete }) {
  const [label, setLabel] = useState("");
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [newPin, setNewPin] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isResettingPin, setIsResettingPin] = useState(false);
  const [error, setError] = useState("");
  const [pinSaved, setPinSaved] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    setPinSaved(false);
    setNewPin("");
    setLabel(initialCounter?.label ?? "");
    setUsername(initialCounter?.username ?? "");
    setIsActive(initialCounter?.isActive ?? true);
    setPin("");
  }, [isOpen, initialCounter]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!label.trim() || !username.trim()) {
      setError("Enter a label and a username.");
      return;
    }
    if (!initialCounter && pin.trim().length < 4) {
      setError("Set a PIN with at least 4 digits.");
      return;
    }
    setIsSaving(true);
    setError("");
    try {
      await onSave({ label: label.trim(), username: username.trim(), isActive, pin: pin.trim() });
      onClose();
    } catch (err) {
      setError(err.message || "Couldn't save this counter.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleResetPin() {
    if (newPin.trim().length < 4) {
      setError("New PIN needs at least 4 digits.");
      return;
    }
    setIsResettingPin(true);
    setError("");
    try {
      await onResetPin(newPin.trim());
      setPinSaved(true);
      setNewPin("");
    } catch (err) {
      setError(err.message || "Couldn't reset the PIN.");
    } finally {
      setIsResettingPin(false);
    }
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={initialCounter ? "Edit counter" : "Add billing counter"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error ? <p className="rounded-xl bg-danger/15 px-3 py-2 text-sm text-danger">{error}</p> : null}

        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Label
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="input mt-1.5 normal-case"
            placeholder="Counter 1"
          />
        </label>

        <label className="block text-xs font-medium uppercase tracking-wide text-muted">
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input mt-1.5 normal-case"
            placeholder="counter1"
          />
        </label>

        {!initialCounter ? (
          <label className="block text-xs font-medium uppercase tracking-wide text-muted">
            PIN
            <input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="input mt-1.5 normal-case"
              placeholder="4-6 digits"
              inputMode="numeric"
            />
          </label>
        ) : (
          <div className="rounded-2xl border border-line p-3.5">
            <Switch checked={isActive} onChange={setIsActive} label="Login active" />
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-accent py-3 text-sm font-semibold text-canvas disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save"}
        </button>

        {initialCounter ? (
          <>
            <div className="rounded-2xl border border-line p-3.5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Reset PIN</p>
              <div className="flex gap-2">
                <input
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="input"
                  placeholder="New 4-6 digit PIN"
                  inputMode="numeric"
                />
                <button
                  type="button"
                  onClick={handleResetPin}
                  disabled={isResettingPin}
                  className="shrink-0 rounded-xl border border-line px-4 text-sm font-medium text-ink disabled:opacity-60"
                >
                  {isResettingPin ? "…" : pinSaved ? "Done ✓" : "Reset"}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Remove login "${initialCounter.username}"?`)) onDelete();
              }}
              className="rounded-xl border border-danger/40 py-3 text-sm font-semibold text-danger"
            >
              Delete counter
            </button>
          </>
        ) : null}
      </form>
    </BottomSheet>
  );
}
