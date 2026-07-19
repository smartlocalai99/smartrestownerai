import { getSupabase } from "./supabaseClient.js";

const BUCKET = "restaurant-media";

function extensionOf(file) {
  const fromName = file.name?.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName;
  const fromType = file.type?.split("/").pop();
  return fromType || "jpg";
}

function pathFromPublicUrl(url) {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

export async function uploadRestaurantImage(file, folder, client = getSupabase()) {
  const path = `${folder}/${crypto.randomUUID()}.${extensionOf(file)}`;
  const { error } = await client.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteRestaurantImage(url, client = getSupabase()) {
  const path = pathFromPublicUrl(url);
  if (!path) return;
  const { error } = await client.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}
