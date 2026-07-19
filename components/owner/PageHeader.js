import Link from "next/link";
import { MdArrowBack } from "react-icons/md";

export default function PageHeader({ eyebrow, title, right, backHref }) {
  return (
    <header className="relative border-b border-line bg-surface px-5 pb-5 pt-[calc(env(safe-area-inset-top,0px)+1.25rem)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          {backHref ? (
            <Link
              href={backHref}
              className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink"
              aria-label="Back"
            >
              <MdArrowBack size={18} />
            </Link>
          ) : null}
          <div>
            {eyebrow ? (
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">{eyebrow}</p>
            ) : null}
            <h1 className="mt-1 font-display text-2xl font-semibold text-ink">{title}</h1>
          </div>
        </div>
        {right ? <div className="shrink-0 pt-0.5">{right}</div> : null}
      </div>
    </header>
  );
}
