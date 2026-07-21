import { getSupabase } from "./supabaseClient.js";
import { deleteRestaurantImage } from "./storage.mjs";

export function categoryFromRow(row) {
  return {
    id: row.id,
    label: row.label,
    imageUrl: row.image_url,
    sectionId: row.section_id,
    displayOrder: row.display_order,
    isActive: row.is_active,
  };
}

export async function listCategories(client = getSupabase()) {
  const { data, error } = await client
    .from("menu_categories")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(categoryFromRow);
}

export async function createCategory(fields, displayOrder, client = getSupabase()) {
  const { data, error } = await client
    .from("menu_categories")
    .insert({
      label: fields.label,
      image_url: fields.imageUrl ?? null,
      section_id: fields.sectionId ?? null,
      is_active: fields.isActive ?? true,
      display_order: displayOrder,
    })
    .select()
    .single();
  if (error) throw error;
  return categoryFromRow(data);
}

export async function updateCategory(id, fields, client = getSupabase()) {
  const row = {};
  if (fields.label !== undefined) row.label = fields.label;
  if (fields.imageUrl !== undefined) row.image_url = fields.imageUrl;
  if (fields.sectionId !== undefined) row.section_id = fields.sectionId;
  if (fields.isActive !== undefined) row.is_active = fields.isActive;
  if (fields.displayOrder !== undefined) row.display_order = fields.displayOrder;

  const { data, error } = await client.from("menu_categories").update(row).eq("id", id).select().single();
  if (error) throw error;
  return categoryFromRow(data);
}

export async function deleteCategory(id, imageUrl, client = getSupabase()) {
  await deleteRestaurantImage(imageUrl, client);
  const { error } = await client.from("menu_categories").delete().eq("id", id);
  if (error) throw error;
}
