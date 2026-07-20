import Link from "next/link";
import { MdArrowBack } from "react-icons/md";

export default function PageHeader({ eyebrow, title, right, backHref }) {
  return (
    <header className="shadow-soft relative z-10 bg-surface px-5 pb-5 pt-[calc(env(safe-area-inset-top,0px)+1.25rem)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          {backHref ? (
            <Link
              href={backHref}
              className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink transition-colors active:bg-line"
              aria-label="Back"
            >
              <MdArrowBack size={18} />
            </Link>
          ) : null}
          <div>
            {eyebrow ? (
              <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {eyebrow}
              </p>
            ) : null}
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink">{title}</h1>
          </div>
        </div>
        {right ? <div className="shrink-0 pt-0.5">{right}</div> : null}
      </div>
    </header>
  );
}
