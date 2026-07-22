import { getSupabase } from "./supabaseClient.js";

export async function sendBroadcastNotification(
  { title, body, offerId = null },
  client = getSupabase()
) {
  const payload = {
    title: title.trim(),
    body: body.trim(),
    offerId: offerId || null,
  };
  const { data, error } = await client.functions.invoke("broadcast-push", {
    body: payload,
  });
  if (error) throw error;
  return data;
}
