import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  MdOutlineReceiptLong,
  MdOutlinePayments,
  MdOutlineTrendingUp,
  MdOutlineCalendarToday,
  MdOutlineLocationOn,
  MdOutlineNotificationsActive,
  MdOutlineRestaurantMenu,
} from "react-icons/md";
import AppShell from "@/components/owner/AppShell";
import PageHeader from "@/components/owner/PageHeader";
import Card from "@/components/owner/Card";
import StatTile from "@/components/owner/dashboard/StatTile";
import StatusPill from "@/components/owner/StatusPill";
import { getCustomerDetail } from "@/lib/customersData.mjs";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const STATUS_TONE = {
  preparing: "accent",
  out_for_delivery: "accent",
  delivered: "success",
  cancelled: "danger",
};

function formatDateTime(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CustomerDetailPage() {
  const router = useRouter();
  const { phone } = router.query;
  const [detail, setDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!phone) return;
    setIsLoading(true);
    getCustomerDetail(phone)
      .then(setDetail)
      .catch(() => setError("Could not load this customer."))
      .finally(() => setIsLoading(false));
  }, [phone]);

  return (
    <AppShell>
      <Head>
        <title>{detail?.customer?.name || "Customer"} — Mandi Kings Owner</title>
      </Head>

      <PageHeader eyebrow={phone ? `+91 ${phone}` : "Customer"} title={detail?.customer?.name || "Customer"} backHref="/customers" />

      {isLoading ? (
        <p className="py-8 text-center text-sm text-muted">Loading…</p>
      ) : error ? (
        <p className="py-8 text-center text-sm text-danger">{error}</p>
      ) : detail ? (
        <div className="flex flex-col gap-4 px-5">
          <Link
            href={`/notifications?phone=${detail.customer.phone}&name=${encodeURIComponent(detail.customer.name || "")}`}
            className="flex items-center justify-center gap-2 rounded-2xl bg-ink py-3 text-sm font-medium text-surface transition-opacity active:opacity-90"
          >
            <MdOutlineNotificationsActive size={18} />
            Send a notification to this customer
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Total orders" value={detail.orderCount} icon={MdOutlineReceiptLong} />
            <StatTile label="Total spent" value={currency.format(detail.totalSpent)} tone="success" icon={MdOutlinePayments} />
            <StatTile label="Avg order value" value={currency.format(Math.round(detail.avgOrderValue))} icon={MdOutlineTrendingUp} />
            <StatTile
              label="Customer since"
              value={new Date(detail.customer.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
              icon={MdOutlineCalendarToday}
            />
          </div>

          {detail.topItems.length > 0 ? (
            <Card>
              <p className="mb-3 text-sm font-medium text-ink">Most ordered</p>
              <div className="flex flex-col gap-2.5">
                {detail.topItems.map((item, index) => (
                  <div key={item.title} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/12 text-xs font-semibold text-accent">
                      {index + 1}
                    </span>
                    <p className="min-w-0 flex-1 truncate text-sm text-ink">{item.title}</p>
                    <p className="shrink-0 text-xs tabular text-muted">{item.qty}x</p>
                    <p className="shrink-0 text-xs tabular font-medium text-ink">{currency.format(item.revenue)}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {detail.addresses.length > 0 ? (
            <Card>
              <p className="mb-3 text-sm font-medium text-ink">Saved addresses</p>
              <div className="flex flex-col gap-3">
                {detail.addresses.map((address) => (
                  <div key={address.id} className="flex items-start gap-2.5">
                    <MdOutlineLocationOn size={16} className="mt-0.5 shrink-0 text-muted" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-ink">
                        {address.label}
                        {address.isDefault ? <span className="ml-1.5 text-accent">· Default</span> : null}
                      </p>
                      <p className="text-xs text-muted">{address.line}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          <div>
            <p className="mb-2.5 px-0.5 text-sm font-medium text-ink">Order history</p>
            {detail.orders.length === 0 ? (
              <Card className="items-center py-6 text-center">
                <MdOutlineRestaurantMenu size={22} className="mx-auto text-muted" />
                <p className="mt-2 text-xs text-muted">No orders placed yet.</p>
              </Card>
            ) : (
              <div className="flex flex-col gap-2.5">
                {detail.orders.map((order) => (
                  <Card key={order.id} className="gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-ink">Order #{order.id}</p>
                      <StatusPill tone={STATUS_TONE[order.status] ?? "muted"}>
                        {order.status.replace(/_/g, " ")}
                      </StatusPill>
                    </div>
                    <p className="text-xs text-muted">{formatDateTime(order.placed_at)}</p>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>{(order.items ?? []).length} item{(order.items ?? []).length === 1 ? "" : "s"}</span>
                      <span className="text-sm font-semibold tabular text-ink">{currency.format(order.total)}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
