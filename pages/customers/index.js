import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { MdOutlineSearch, MdOutlineGroupOff } from "react-icons/md";
import AppShell from "@/components/owner/AppShell";
import PageHeader from "@/components/owner/PageHeader";
import EmptyState from "@/components/owner/EmptyState";
import CustomerRow from "@/components/owner/customers/CustomerRow";
import { listCustomers } from "@/lib/customersData.mjs";

const SORTS = [
  { id: "recent", label: "Recent" },
  { id: "spend", label: "Top spenders" },
  { id: "orders", label: "Most orders" },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");

  useEffect(() => {
    listCustomers()
      .then(setCustomers)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let list = customers;
    if (normalized) {
      list = list.filter(
        (customer) => customer.name.toLowerCase().includes(normalized) || customer.phone.includes(normalized)
      );
    }
    const sorted = [...list];
    if (sort === "spend") sorted.sort((a, b) => b.totalSpent - a.totalSpent);
    else if (sort === "orders") sorted.sort((a, b) => b.orderCount - a.orderCount);
    else sorted.sort((a, b) => (a.lastOrderAt < b.lastOrderAt ? 1 : -1));
    return sorted;
  }, [customers, query, sort]);

  return (
    <AppShell>
      <Head>
        <title>Customers — Mandi Kings Owner</title>
      </Head>

      <PageHeader eyebrow="Manage" title="Customers" backHref="/dashboard" />

      <div className="flex flex-col gap-3 px-5">
        <label className="shadow-soft flex items-center gap-2 rounded-2xl border border-line/60 bg-surface px-3.5 py-2.5">
          <MdOutlineSearch size={18} className="text-muted" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or phone"
            className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
          />
        </label>

        <div className="flex gap-2">
          {SORTS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSort(id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                sort === id ? "bg-ink text-surface" : "bg-surface-2 text-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="py-8 text-center text-sm text-muted">Loading customers…</p>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={MdOutlineGroupOff}
            title={customers.length === 0 ? "No customers yet" : "No matches"}
            message={
              customers.length === 0
                ? "Customers show up here as soon as someone places their first order."
                : "Try a different name or phone number."
            }
          />
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((customer) => (
              <CustomerRow key={customer.phone} customer={customer} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
