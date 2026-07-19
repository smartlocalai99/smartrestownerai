import { getSupabase } from "./supabaseClient.js";

export async function swapDisplayOrder(table, a, b, client = getSupabase()) {
  await Promise.all([
    client.from(table).update({ display_order: b.displayOrder }).eq("id", a.id),
    client.from(table).update({ display_order: a.displayOrder }).eq("id", b.id),
  ]);
}
