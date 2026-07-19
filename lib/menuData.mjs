import { getSupabase } from "./supabaseClient.js";
import { deleteRestaurantImage } from "./storage.mjs";

export function sectionFromRow(row) {
  return {
    id: row.id,
    title: row.title,
    displayOrder: row.display_order,
    isActive: row.is_active,
  };
}

export function itemFromRow(row) {
  return {
    id: row.id,
    sectionId: row.section_id,
    title: row.title,
    description: row.description ?? "",
    price: Number(row.price),
    oldPrice: row.old_price == null ? null : Number(row.old_price),
    imageUrl: row.image_url,
    isVeg: row.is_veg,
    isBestseller: row.is_bestseller,
    isAvailable: row.is_available,
    prepTimeMinutes: row.prep_time_minutes,
    displayOrder: row.display_order,
  };
}

export async function listMenu(client = getSupabase()) {
  const [{ data: sections, error: sectionsError }, { data: items, error: itemsError }] = await Promise.all([
    client.from("menu_sections").select("*").order("display_order", { ascending: true }),
    client.from("menu_items").select("*").order("display_order", { ascending: true }),
  ]);
  if (sectionsError) throw sectionsError;
  if (itemsError) throw itemsError;

  const itemsBySection = new Map();
  for (const row of items) {
    const item = itemFromRow(row);
    const list = itemsBySection.get(item.sectionId) ?? [];
    list.push(item);
    itemsBySection.set(item.sectionId, list);
  }

  return sections.map((row) => ({
    ...sectionFromRow(row),
    items: itemsBySection.get(row.id) ?? [],
  }));
}

export async function createSection(title, displayOrder, client = getSupabase()) {
  const { data, error } = await client
    .from("menu_sections")
    .insert({ title, display_order: displayOrder })
    .select()
    .single();
  if (error) throw error;
  return sectionFromRow(data);
}

export async function updateSection(id, patch, client = getSupabase()) {
  const row = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.displayOrder !== undefined) row.display_order = patch.displayOrder;
  if (patch.isActive !== undefined) row.is_active = patch.isActive;

  const { data, error } = await client.from("menu_sections").update(row).eq("id", id).select().single();
  if (error) throw error;
  return sectionFromRow(data);
}

export async function deleteSection(id, client = getSupabase()) {
  const { data: items, error: itemsError } = await client
    .from("menu_items")
    .select("image_url")
    .eq("section_id", id);
  if (itemsError) throw itemsError;

  await Promise.all((items ?? []).map((item) => deleteRestaurantImage(item.image_url, client)));

  const { error } = await client.from("menu_sections").delete().eq("id", id);
  if (error) throw error;
}

export async function createItem(sectionId, fields, displayOrder, client = getSupabase()) {
  const { data, error } = await client
    .from("menu_items")
    .insert({
      section_id: sectionId,
      title: fields.title,
      description: fields.description || null,
      price: fields.price,
      old_price: fields.oldPrice ?? null,
      image_url: fields.imageUrl ?? null,
      is_veg: fields.isVeg ?? true,
      is_bestseller: fields.isBestseller ?? false,
      is_available: fields.isAvailable ?? true,
      prep_time_minutes: fields.prepTimeMinutes ?? null,
      display_order: displayOrder,
    })
    .select()
    .single();
  if (error) throw error;
  return itemFromRow(data);
}

export async function updateItem(id, fields, client = getSupabase()) {
  const row = {};
  if (fields.title !== undefined) row.title = fields.title;
  if (fields.description !== undefined) row.description = fields.description || null;
  if (fields.price !== undefined) row.price = fields.price;
  if (fields.oldPrice !== undefined) row.old_price = fields.oldPrice;
  if (fields.imageUrl !== undefined) row.image_url = fields.imageUrl;
  if (fields.isVeg !== undefined) row.is_veg = fields.isVeg;
  if (fields.isBestseller !== undefined) row.is_bestseller = fields.isBestseller;
  if (fields.isAvailable !== undefined) row.is_available = fields.isAvailable;
  if (fields.prepTimeMinutes !== undefined) row.prep_time_minutes = fields.prepTimeMinutes;
  if (fields.displayOrder !== undefined) row.display_order = fields.displayOrder;

  const { data, error } = await client.from("menu_items").update(row).eq("id", id).select().single();
  if (error) throw error;
  return itemFromRow(data);
}

export async function deleteItem(id, imageUrl, client = getSupabase()) {
  await deleteRestaurantImage(imageUrl, client);
  const { error } = await client.from("menu_items").delete().eq("id", id);
  if (error) throw error;
}
