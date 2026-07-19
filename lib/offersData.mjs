import { getSupabase } from "./supabaseClient.js";
import { deleteRestaurantImage } from "./storage.mjs";

export function offerFromRow(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? "",
    imageUrl: row.image_url,
    strikePrice: row.strike_price == null ? null : Number(row.strike_price),
    salePrice: row.sale_price == null ? null : Number(row.sale_price),
    isActive: row.is_active,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    displayOrder: row.display_order,
  };
}

export async function listOffers(client = getSupabase()) {
  const { data, error } = await client.from("offers").select("*").order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(offerFromRow);
}

export async function createOffer(fields, displayOrder, client = getSupabase()) {
  const { data, error } = await client
    .from("offers")
    .insert({
      title: fields.title,
      subtitle: fields.subtitle || null,
      image_url: fields.imageUrl ?? null,
      strike_price: fields.strikePrice ?? null,
      sale_price: fields.salePrice ?? null,
      is_active: fields.isActive ?? true,
      starts_at: fields.startsAt ?? null,
      ends_at: fields.endsAt ?? null,
      display_order: displayOrder,
    })
    .select()
    .single();
  if (error) throw error;
  return offerFromRow(data);
}

export async function updateOffer(id, fields, client = getSupabase()) {
  const row = {};
  if (fields.title !== undefined) row.title = fields.title;
  if (fields.subtitle !== undefined) row.subtitle = fields.subtitle || null;
  if (fields.imageUrl !== undefined) row.image_url = fields.imageUrl;
  if (fields.strikePrice !== undefined) row.strike_price = fields.strikePrice;
  if (fields.salePrice !== undefined) row.sale_price = fields.salePrice;
  if (fields.isActive !== undefined) row.is_active = fields.isActive;
  if (fields.startsAt !== undefined) row.starts_at = fields.startsAt;
  if (fields.endsAt !== undefined) row.ends_at = fields.endsAt;
  if (fields.displayOrder !== undefined) row.display_order = fields.displayOrder;

  const { data, error } = await client.from("offers").update(row).eq("id", id).select().single();
  if (error) throw error;
  return offerFromRow(data);
}

export async function deleteOffer(id, imageUrl, client = getSupabase()) {
  await deleteRestaurantImage(imageUrl, client);
  const { error } = await client.from("offers").delete().eq("id", id);
  if (error) throw error;
}

