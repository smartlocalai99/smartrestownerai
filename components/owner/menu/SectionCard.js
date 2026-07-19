import { useState } from "react";
import { MdExpandMore, MdOutlineEdit, MdArrowUpward, MdArrowDownward, MdAdd } from "react-icons/md";
import ItemRow from "./ItemRow";

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
          {section.items.map((item) => (
            <ItemRow key={item.id} item={item} onOpen={() => onEditItem(item)} />
          ))}

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
