import LazyImage from "@/components/owner/LazyImage";
import { MdChevronRight } from "react-icons/md";

export default function ItemRow({ item, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition-colors active:bg-surface-2"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-canvas">
        {item.imageUrl ? (
          <LazyImage src={item.imageUrl} alt="" sizes="56px" className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[10px] text-muted">No photo</span>
        )}
        <span
          className={`absolute left-1 top-1 h-2.5 w-2.5 rounded-sm border ${
            item.isVeg ? "border-success bg-success/80" : "border-danger bg-danger/80"
          }`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium ${item.isAvailable ? "text-ink" : "text-muted line-through"}`}>
          {item.title}
        </p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-sm text-ink">₹{item.price}</span>
          {item.oldPrice ? <span className="text-xs text-muted line-through">₹{item.oldPrice}</span> : null}
          {item.isBestseller ? <span className="text-xs text-accent">Bestseller</span> : null}
          {!item.isAvailable ? <span className="text-xs text-danger">Sold out</span> : null}
        </div>
      </div>

      <MdChevronRight className="shrink-0 text-muted" size={20} />
    </button>
  );
}
