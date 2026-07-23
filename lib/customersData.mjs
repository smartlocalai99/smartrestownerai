import { getSupabase } from "./supabaseClient.js";

function summarizeOrders(orders) {
  const active = orders.filter((order) => order.status !== "cancelled");
  const totalSpent = active.reduce((sum, order) => sum + Number(order.total), 0);
  const lastOrderAt = orders.reduce(
    (latest, order) => (!latest || order.placed_at > latest ? order.placed_at : latest),
    null
  );
  return { orderCount: orders.length, totalSpent, lastOrderAt };
}

export async function listCustomers(client = getSupabase()) {
  const [{ data: customers, error: customersError }, { data: orders, error: ordersError }] = await Promise.all([
    client.from("customers").select("phone, name, email, created_at").order("created_at", { ascending: false }),
    client.from("customer_orders").select("customer_phone, total, status, placed_at"),
  ]);
  if (customersError) throw customersError;
  if (ordersError) throw ordersError;

  const ordersByPhone = new Map();
  for (const order of orders ?? []) {
    const list = ordersByPhone.get(order.customer_phone) ?? [];
    list.push(order);
    ordersByPhone.set(order.customer_phone, list);
  }

  return (customers ?? []).map((customer) => {
    const summary = summarizeOrders(ordersByPhone.get(customer.phone) ?? []);
    return {
      phone: customer.phone,
      name: customer.name || "",
      email: customer.email || "",
      createdAt: customer.created_at,
      ...summary,
    };
  });
}

function itemFrequency(orders) {
  const totals = new Map();
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    for (const line of order.items ?? []) {
      const title = line.item?.title;
      if (!title) continue;
      const existing = totals.get(title) ?? { title, qty: 0, revenue: 0, imageUrl: line.item?.imageUrl || null };
      existing.qty += Number(line.quantity ?? 0);
      existing.revenue += Number(line.item?.price ?? 0) * Number(line.quantity ?? 0);
      totals.set(title, existing);
    }
  }
  return [...totals.values()].sort((a, b) => b.qty - a.qty);
}

export async function getCustomerDetail(phone, client = getSupabase()) {
  const [{ data: customer, error: customerError }, { data: addresses, error: addressesError }, { data: orders, error: ordersError }] =
    await Promise.all([
      client.from("customers").select("phone, name, email, created_at").eq("phone", phone).single(),
      client.from("customer_addresses").select("*").eq("customer_phone", phone).order("is_default", { ascending: false }),
      client.from("customer_orders").select("*").eq("customer_phone", phone).order("placed_at", { ascending: false }),
    ]);
  if (customerError) throw customerError;
  if (addressesError) throw addressesError;
  if (ordersError) throw ordersError;

  const ordersList = orders ?? [];
  const summary = summarizeOrders(ordersList);
  const topItems = itemFrequency(ordersList).slice(0, 8);
  const avgOrderValue = summary.orderCount > 0 ? summary.totalSpent / Math.max(summary.orderCount - countCancelled(ordersList), 1) : 0;

  return {
    customer: {
      phone: customer.phone,
      name: customer.name || "",
      email: customer.email || "",
      createdAt: customer.created_at,
    },
    addresses: (addresses ?? []).map((row) => ({
      id: row.id,
      label: row.label,
      line: row.address_line,
      landmark: row.landmark,
      phone: row.contact_phone,
      isDefault: row.is_default,
    })),
    orders: ordersList,
    topItems,
    ...summary,
    avgOrderValue,
  };
}

function countCancelled(orders) {
  return orders.filter((order) => order.status === "cancelled").length;
}
