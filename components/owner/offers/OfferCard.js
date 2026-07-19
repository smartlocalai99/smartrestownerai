import Image from "next/image";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";

export default function OfferCard({ offer, isFirst, isLast, onOpen, onMoveUp, onMoveDown }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
      <button type="button" onClick={onOpen} className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-canvas">
        {offer.imageUrl ? (
          <Image src={offer.imageUrl} alt="" fill sizes="96px" className="object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[10px] text-muted">No photo</span>
        )}
      </button>

      <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
        <p className={`truncate text-sm font-semibold ${offer.isActive ? "text-ink" : "text-muted"}`}>
          {offer.title}
        </p>
        {offer.subtitle ? <p className="truncate text-xs text-muted">{offer.subtitle}</p> : null}
        <div className="mt-1 flex items-center gap-2">
          {offer.salePrice != null ? <span className="text-sm text-accent">₹{offer.salePrice}</span> : null}
          {offer.strikePrice != null ? (
            <span className="text-xs text-muted line-through">₹{offer.strikePrice}</span>
          ) : null}
          {!offer.isActive ? <span className="text-xs text-danger">Hidden</span> : null}
        </div>
      </button>

      <div className="flex shrink-0 flex-col gap-1">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted disabled:opacity-30"
          aria-label="Move up"
        >
          <MdArrowUpward size={15} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          className="flex h-7 w-7 items-center justify-center rounded-full text-muted disabled:opacity-30"
          aria-label="Move down"
        >
          <MdArrowDownward size={15} />
        </button>
      </div>
    </div>
  );
}
