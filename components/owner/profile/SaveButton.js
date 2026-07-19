export default function SaveButton({ isSaving, saved }) {
  return (
    <button
      type="submit"
      disabled={isSaving}
      className="rounded-xl bg-accent py-2.5 text-sm font-semibold text-canvas disabled:opacity-60"
    >
      {isSaving ? "Saving…" : saved ? "Saved ✓" : "Save"}
    </button>
  );
}
