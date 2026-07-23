import Link from "next/link";
import { MdChevronRight, MdOutlinePerson } from "react-icons/md";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatDate(value) {
  if (!value) return "No orders yet";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function CustomerRow({ customer }) {
  return (
    <Link
      href={`/customers/${customer.phone}`}
      className="shadow-soft flex items-center gap-3 rounded-2xl border border-line/60 bg-surface p-3.5 transition-colors active:bg-surface-2"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
        <MdOutlinePerson size={20} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{customer.name || `+91 ${customer.phone}`}</p>
        <p className="mt-0.5 truncate text-xs text-muted">
          {customer.name ? `+91 ${customer.phone} · ` : ""}
          {customer.orderCount} order{customer.orderCount === 1 ? "" : "s"} · last {formatDate(customer.lastOrderAt)}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-sm font-semibold tabular text-ink">{currency.format(customer.totalSpent)}</p>
      </div>

      <MdChevronRight size={18} className="shrink-0 text-muted" />
    </Link>
  );
}
