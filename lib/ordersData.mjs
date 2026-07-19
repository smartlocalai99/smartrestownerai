import { getSupabase } from "./supabaseClient.js";

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function localDateKey(iso) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getRangeBounds(range) {
  const now = new Date();
  if (range === "today") {
    return { start: startOfDay(now), end: now };
  }
  const start = startOfDay(now);
  start.setDate(start.getDate() - 6);
  return { start, end: now };
}

export async function listOrdersInRange(start, end, client = getSupabase()) {
  const { data, error } = await client
    .from("customer_orders")
    .select(
      "id, items, subtotal, discount, delivery_fee, total, status, payment_status, payment_method, cod_collected, customer_phone, placed_at"
    )
    .gte("placed_at", start.toISOString())
    .lte("placed_at", end.toISOString())
    .order("placed_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export function computeMetrics(orders) {
  const active = orders.filter((order) => order.status !== "cancelled");

  const totalSales = active.reduce((sum, order) => sum + Number(order.total), 0);
  const orderCount = active.length;

  const cashCollected = orders
    .filter((order) => order.payment_method?.id === "cod" && order.cod_collected)
    .reduce((sum, order) => sum + Number(order.total), 0);

  const cashPending = orders
    .filter((order) => order.payment_method?.id === "cod" && !order.cod_collected && order.status !== "cancelled")
    .reduce((sum, order) => sum + Number(order.total), 0);

  const itemTotals = new Map();
  for (const order of active) {
    for (const line of order.items ?? []) {
      const title = line.item?.title;
      if (!title) continue;
      const existing = itemTotals.get(title) ?? { title, qty: 0, revenue: 0 };
      existing.qty += Number(line.quantity ?? 0);
      existing.revenue += Number(line.item?.price ?? 0) * Number(line.quantity ?? 0);
      itemTotals.set(title, existing);
    }
  }
  const topItems = [...itemTotals.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);

  const byDay = new Map();
  for (const order of active) {
    const day = localDateKey(order.placed_at);
    byDay.set(day, (byDay.get(day) ?? 0) + Number(order.total));
  }
  const trend = [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, total]) => ({ day, total }));

  return { totalSales, orderCount, cashCollected, cashPending, topItems, trend };
}

export async function countTotalCustomers(client = getSupabase()) {
  const { count, error } = await client.from("customers").select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}
