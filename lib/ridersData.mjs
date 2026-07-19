import { getSupabase } from "./supabaseClient.js";
import { deleteRestaurantImage } from "./storage.mjs";

export function riderFromRow(row) {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone ?? "",
    vehicleNumber: row.vehicle_number ?? "",
    photoUrl: row.photo_url,
    isActive: row.is_active,
    status: row.status,
  };
}

export async function listRiders(client = getSupabase()) {
  const { data, error } = await client.from("delivery_riders").select("*").order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(riderFromRow);
}

export async function createRider(fields, client = getSupabase()) {
  const { data, error } = await client
    .from("delivery_riders")
    .insert({
      name: fields.name,
      phone: fields.phone || null,
      vehicle_number: fields.vehicleNumber || null,
      photo_url: fields.photoUrl ?? null,
      status: fields.status ?? "available",
    })
    .select()
    .single();
  if (error) throw error;
  return riderFromRow(data);
}

export async function updateRider(id, fields, client = getSupabase()) {
  const row = {};
  if (fields.name !== undefined) row.name = fields.name;
  if (fields.phone !== undefined) row.phone = fields.phone || null;
  if (fields.vehicleNumber !== undefined) row.vehicle_number = fields.vehicleNumber || null;
  if (fields.photoUrl !== undefined) row.photo_url = fields.photoUrl;
  if (fields.isActive !== undefined) row.is_active = fields.isActive;
  if (fields.status !== undefined) row.status = fields.status;

  const { data, error } = await client.from("delivery_riders").update(row).eq("id", id).select().single();
  if (error) throw error;
  return riderFromRow(data);
}

export async function deleteRider(id, photoUrl, client = getSupabase()) {
  await deleteRestaurantImage(photoUrl, client);
  const { error } = await client.from("delivery_riders").delete().eq("id", id);
  if (error) throw error;
}
