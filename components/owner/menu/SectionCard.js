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
    <div className="shadow-soft overflow-hidden rounded-2xl border border-line/60 bg-surface">
      <div className="flex items-center gap-1 py-2 pl-3.5 pr-2">
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="flex flex-1 items-center gap-2 py-1.5 text-left"
        >
          <MdExpandMore
            size={20}
            className={`shrink-0 text-muted transition-transform ${isExpanded ? "" : "-rotate-90"}`}
          />
          <span className={`text-sm font-semibold ${section.isActive ? "text-ink" : "text-muted"}`}>
            {section.title}
          </span>
          <span className="text-xs tabular text-muted">({section.items.length})</span>
          {!section.isActive ? (
            <span className="rounded-full bg-danger/10 px-1.5 py-0.5 text-[10px] font-medium text-danger">
              Hidden
            </span>
          ) : null}
        </button>

        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors active:bg-surface-2 disabled:opacity-25"
            aria-label="Move section up"
          >
            <MdArrowUpward size={16} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors active:bg-surface-2 disabled:opacity-25"
            aria-label="Move section down"
          >
            <MdArrowDownward size={16} />
          </button>
          <span className="mx-0.5 h-4 w-px bg-line" />
          <button
            type="button"
            onClick={onEdit}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors active:bg-surface-2"
            aria-label="Edit section"
          >
            <MdOutlineEdit size={17} />
          </button>
        </div>
      </div>

      {isExpanded ? (
        <div className="flex flex-col gap-0.5 border-t border-line/60 px-2 pb-2.5 pt-2">
          <LazyItemList items={section.items} onEditItem={onEditItem} />

          <button
            type="button"
            onClick={onAddItem}
            className="mt-1 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-line py-2.5 text-sm font-medium text-accent transition-colors active:bg-accent/5"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/12">
              <MdAdd size={14} />
            </span>
            Add item
          </button>
        </div>
      ) : null}
    </div>
  );
}
