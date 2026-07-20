import { getSupabase } from "./supabaseClient.js";
import { deleteRestaurantImage } from "./storage.mjs";

const SELECT_WITH_ITEMS = "*, offer_items(menu_item_id, menu_items(id, title, price, image_url))";

export function offerFromRow(row) {
  const items = (row.offer_items ?? [])
    .map((link) => link.menu_items)
    .filter(Boolean)
    .map((item) => ({
      id: item.id,
      title: item.title,
      price: Number(item.price),
      imageUrl: item.image_url,
    }));

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
    items,
  };
}

export async function listOffers(client = getSupabase()) {
  const { data, error } = await client
    .from("offers")
    .select(SELECT_WITH_ITEMS)
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(offerFromRow);
}

async function getOfferById(id, client) {
  const { data, error } = await client.from("offers").select(SELECT_WITH_ITEMS).eq("id", id).single();
  if (error) throw error;
  return offerFromRow(data);
}

async function syncOfferItems(offerId, itemIds, client) {
  const { error: deleteError } = await client.from("offer_items").delete().eq("offer_id", offerId);
  if (deleteError) throw deleteError;
  if (!itemIds?.length) return;

  const rows = itemIds.map((menuItemId) => ({ offer_id: offerId, menu_item_id: menuItemId }));
  const { error: insertError } = await client.from("offer_items").insert(rows);
  if (insertError) throw insertError;
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

  await syncOfferItems(data.id, fields.itemIds, client);
  return getOfferById(data.id, client);
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

  if (Object.keys(row).length > 0) {
    const { error } = await client.from("offers").update(row).eq("id", id);
    if (error) throw error;
  }

  if (fields.itemIds !== undefined) {
    await syncOfferItems(id, fields.itemIds, client);
  }

  return getOfferById(id, client);
}

export async function deleteOffer(id, imageUrl, client = getSupabase()) {
  await deleteRestaurantImage(imageUrl, client);
  const { error } = await client.from("offers").delete().eq("id", id);
  if (error) throw error;
}
