import { useState } from "react";
import { MdExpandMore, MdOutlineEdit, MdArrowUpward, MdArrowDownward, MdAdd } from "react-icons/md";
import useInView from "@/hooks/useInView";
import ItemRow from "./ItemRow";

function ItemRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-surface-2" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="h-3.5 w-2/3 animate-pulse rounded-full bg-surface-2" />
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-surface-2" />
      </div>
    </div>
  );
}

// Only mounts real item rows (and their photos) once this section scrolls
// near the viewport, so a long menu doesn't fetch every photo up front.
function LazyItemList({ items, onEditItem }) {
  const [ref, isInView] = useInView({ rootMargin: "600px" });

  return (
    <div ref={ref} className="flex flex-col gap-0.5">
      {isInView
        ? items.map((item) => <ItemRow key={item.id} item={item} onOpen={() => onEditItem(item)} />)
        : items.map((item) => <ItemRowSkeleton key={item.id} />)}
    </div>
  );
}

export default function SectionCard({
  section,
  isFirst,
  isLast,
  onEdit,
  onMoveUp,
  onMoveDown,
  onAddItem,
  onEditItem,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-2xl border border-line bg-surface">
      <div className="flex items-center gap-2 px-3 py-3">
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <MdExpandMore
            size={20}
            className={`shrink-0 text-muted transition-transform ${isExpanded ? "" : "-rotate-90"}`}
          />
          <span className={`text-sm font-semibold ${section.isActive ? "text-ink" : "text-muted"}`}>
            {section.title}
          </span>
          <span className="text-xs text-muted">({section.items.length})</span>
          {!section.isActive ? <span className="text-xs text-danger">Hidden</span> : null}
        </button>

        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted disabled:opacity-30"
          aria-label="Move section up"
        >
          <MdArrowUpward size={16} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted disabled:opacity-30"
          aria-label="Move section down"
        >
          <MdArrowDownward size={16} />
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted"
          aria-label="Edit section"
        >
          <MdOutlineEdit size={17} />
        </button>
      </div>

      {isExpanded ? (
        <div className="flex flex-col gap-0.5 px-2 pb-2">
          <LazyItemList items={section.items} onEditItem={onEditItem} />

          <button
            type="button"
            onClick={onAddItem}
            className="flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-line py-2.5 text-sm font-medium text-muted"
          >
            <MdAdd size={18} /> Add item
          </button>
        </div>
      ) : null}
    </div>
  );
}
