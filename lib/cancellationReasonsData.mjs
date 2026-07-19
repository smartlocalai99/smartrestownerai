import { getSupabase } from "./supabaseClient.js";

export function reasonFromRow(row) {
  return {
    id: row.id,
    reason: row.reason,
    displayOrder: row.display_order,
    isActive: row.is_active,
  };
}

export async function listCancellationReasons(client = getSupabase()) {
  const { data, error } = await client
    .from("cancellation_reasons")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(reasonFromRow);
}

export async function createCancellationReason(reason, displayOrder, client = getSupabase()) {
  const { data, error } = await client
    .from("cancellation_reasons")
    .insert({ reason, display_order: displayOrder })
    .select()
    .single();
  if (error) throw error;
  return reasonFromRow(data);
}

export async function updateCancellationReason(id, patch, client = getSupabase()) {
  const row = {};
  if (patch.reason !== undefined) row.reason = patch.reason;
  if (patch.isActive !== undefined) row.is_active = patch.isActive;

  const { data, error } = await client
    .from("cancellation_reasons")
    .update(row)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return reasonFromRow(data);
}

export async function deleteCancellationReason(id, client = getSupabase()) {
  const { error } = await client.from("cancellation_reasons").delete().eq("id", id);
  if (error) throw error;
}
