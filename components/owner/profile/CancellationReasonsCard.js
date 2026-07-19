import { useEffect, useState } from "react";
import Card from "@/components/owner/Card";
import { MdAdd, MdClose } from "react-icons/md";
import {
  listCancellationReasons,
  createCancellationReason,
  updateCancellationReason,
  deleteCancellationReason,
} from "@/lib/cancellationReasonsData.mjs";

export default function CancellationReasonsCard() {
  const [reasons, setReasons] = useState([]);
  const [newReason, setNewReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listCancellationReasons()
      .then(setReasons)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  async function handleAdd(event) {
    event.preventDefault();
    if (!newReason.trim()) return;
    const created = await createCancellationReason(newReason.trim(), reasons.length);
    setReasons((list) => [...list, created]);
    setNewReason("");
  }

  async function handleRemove(id) {
    await deleteCancellationReason(id);
    setReasons((list) => list.filter((r) => r.id !== id));
  }

  async function handleToggle(id, isActive) {
    setReasons((list) => list.map((r) => (r.id === id ? { ...r, isActive } : r)));
    await updateCancellationReason(id, { isActive });
  }

  return (
    <Card>
      <p className="mb-1 text-sm font-medium text-ink">Cancellation reasons</p>
      <p className="mb-3 text-xs text-muted">Shown when you or a billing counter cancels an order.</p>

      {isLoading ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {reasons.map((reason) => (
            <li key={reason.id} className="flex items-center gap-2 rounded-xl border border-line px-3 py-2">
              <button
                type="button"
                onClick={() => handleToggle(reason.id, !reason.isActive)}
                className={`flex-1 text-left text-sm ${reason.isActive ? "text-ink" : "text-muted line-through"}`}
              >
                {reason.reason}
              </button>
              <button
                type="button"
                onClick={() => handleRemove(reason.id)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-muted"
                aria-label="Remove reason"
              >
                <MdClose size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="mt-3 flex gap-2">
        <input
          value={newReason}
          onChange={(e) => setNewReason(e.target.value)}
          className="input"
          placeholder="Add a reason"
        />
        <button
          type="submit"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-canvas"
          aria-label="Add reason"
        >
          <MdAdd size={20} />
        </button>
      </form>
    </Card>
  );
}
