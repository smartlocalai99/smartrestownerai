import { getSupabase } from "./supabaseClient.js";

export function counterFromRow(row) {
  return {
    id: row.id,
    label: row.label,
    username: row.username,
    isActive: row.is_active,
  };
}

export async function listBillingCounters(client = getSupabase()) {
  const { data, error } = await client
    .from("billing_counters")
    .select("id, label, username, is_active")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(counterFromRow);
}

async function hashPin(pin, client) {
  const { data, error } = await client.rpc("hash_pin", { pin });
  if (error) throw error;
  return data;
}

export async function createBillingCounter(label, username, pin, client = getSupabase()) {
  const pinHash = await hashPin(pin, client);
  const { data, error } = await client
    .from("billing_counters")
    .insert({ label, username, pin_hash: pinHash })
    .select("id, label, username, is_active")
    .single();
  if (error) throw error;
  return counterFromRow(data);
}

export async function updateBillingCounter(id, fields, client = getSupabase()) {
  const row = {};
  if (fields.label !== undefined) row.label = fields.label;
  if (fields.username !== undefined) row.username = fields.username;
  if (fields.isActive !== undefined) row.is_active = fields.isActive;

  const { data, error } = await client
    .from("billing_counters")
    .update(row)
    .eq("id", id)
    .select("id, label, username, is_active")
    .single();
  if (error) throw error;
  return counterFromRow(data);
}

export async function resetBillingCounterPin(id, pin, client = getSupabase()) {
  const pinHash = await hashPin(pin, client);
  const { error } = await client.from("billing_counters").update({ pin_hash: pinHash }).eq("id", id);
  if (error) throw error;
}

export async function deleteBillingCounter(id, client = getSupabase()) {
  const { error } = await client.from("billing_counters").delete().eq("id", id);
  if (error) throw error;
}
