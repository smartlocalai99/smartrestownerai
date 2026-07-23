import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  MdOutlineAccountBalanceWallet,
  MdOutlinePendingActions,
  MdOutlineGroup,
  MdOutlineTwoWheeler,
  MdOutlineNotificationsNone,
} from "react-icons/md";
import AppShell from "@/components/owner/AppShell";
import PageHeader from "@/components/owner/PageHeader";
import StatusPill from "@/components/owner/StatusPill";
import Switch from "@/components/owner/Switch";
import Card from "@/components/owner/Card";
import RangeToggle from "@/components/owner/dashboard/RangeToggle";
import HeroStat from "@/components/owner/dashboard/HeroStat";
import SalesTrendChart from "@/components/owner/dashboard/SalesTrendChart";
import TopItemsChart from "@/components/owner/dashboard/TopItemsChart";
import StatTile from "@/components/owner/dashboard/StatTile";
import RidersStrip from "@/components/owner/dashboard/RidersStrip";
import { getRestaurantProfile, updateRestaurantProfile } from "@/lib/restaurantProfile.mjs";
import { getRangeBounds, listOrdersInRange, computeMetrics, countTotalCustomers } from "@/lib/ordersData.mjs";
import { listRiders } from "@/lib/ridersData.mjs";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [riders, setRiders] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [range, setRange] = useState("today");
  const [metrics, setMetrics] = useState(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

  useEffect(() => {
    getRestaurantProfile().then(setProfile).catch(() => {});
    listRiders().then(setRiders).catch(() => {});
    countTotalCustomers().then(setTotalCustomers).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingMetrics(true);
    const { start, end } = getRangeBounds(range);
    listOrdersInRange(start, end)
      .then((orders) => {
        if (cancelled) return;
        setMetrics(computeMetrics(orders));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoadingMetrics(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  const handleToggle = useCallback(
    async (field, value) => {
      setProfile((prev) => (prev ? { ...prev, [field]: value } : prev));
      try {
        await updateRestaurantProfile({ [field]: value });
      } catch {
        setProfile((prev) => (prev ? { ...prev, [field]: !value } : prev));
      }
    },
    []
  );

  const availableRiders = riders.filter((rider) => rider.isActive && rider.status === "available").length;
  const activeRiderCount = riders.filter((rider) => rider.isActive).length;

  return (
    <AppShell>
      <Head>
        <title>Dashboard — Mandi Kings Owner</title>
      </Head>

      <PageHeader
        eyebrow="Mandi Kings"
        title="Dashboard"
        right={
          <div className="flex items-center gap-2">
            {profile ? (
              profile.busyMode ? (
                <StatusPill tone="danger">Busy</StatusPill>
              ) : profile.isOpen ? (
                <StatusPill tone="success">Open</StatusPill>
              ) : (
                <StatusPill tone="muted">Closed</StatusPill>
              )
            ) : null}
            <Link
              href="/notifications"
              aria-label="Send notifications"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-ink transition-colors active:bg-line"
            >
              <MdOutlineNotificationsNone size={18} />
            </Link>
          </div>
        }
      />

      <div className="flex flex-col gap-4 px-5">
        {profile ? (
          <Card className="flex flex-col gap-3.5">
            <Switch checked={profile.isOpen} onChange={(v) => handleToggle("isOpen", v)} label="Accepting orders" />
            <Switch checked={profile.busyMode} onChange={(v) => handleToggle("busyMode", v)} label="Busy mode" />
          </Card>
        ) : null}

        <RangeToggle value={range} onChange={setRange} />

        <div className={isLoadingMetrics ? "opacity-60 transition-opacity" : "transition-opacity"}>
          {metrics ? (
            <div className="flex flex-col gap-4">
              <HeroStat
                label={range === "today" ? "Sales today" : "Sales this week"}
                value={metrics.totalSales}
                orderCount={metrics.orderCount}
                trend={metrics.trend}
              />

              {range === "week" && metrics.trend.length > 1 ? (
                <Card>
                  <p className="mb-2 text-sm font-medium text-ink">Sales trend</p>
                  <SalesTrendChart trend={metrics.trend} />
                </Card>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
                <StatTile
                  label="Cash collected"
                  value={currency.format(metrics.cashCollected)}
                  tone="success"
                  icon={MdOutlineAccountBalanceWallet}
                />
                <StatTile
                  label="Cash pending"
                  value={currency.format(metrics.cashPending)}
                  tone={metrics.cashPending > 0 ? "danger" : "ink"}
                  icon={MdOutlinePendingActions}
                />
                <Link href="/customers" className="block">
                  <StatTile label="Total customers" value={totalCustomers} icon={MdOutlineGroup} />
                </Link>
                <StatTile
                  label="Riders available"
                  value={`${availableRiders}/${activeRiderCount}`}
                  tone={activeRiderCount === 0 ? "ink" : availableRiders > 0 ? "success" : "danger"}
                  icon={MdOutlineTwoWheeler}
                />
              </div>

              <Card>
                <p className="mb-2 text-sm font-medium text-ink">Top selling items</p>
                <TopItemsChart items={metrics.topItems} />
              </Card>

              <RidersStrip riders={riders} />
            </div>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
