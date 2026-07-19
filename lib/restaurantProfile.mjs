import { getSupabase } from "./supabaseClient.js";

const FIELD_MAP = {
  name: "name",
  description: "description",
  phone: "phone",
  addressLine: "address_line",
  lat: "lat",
  lng: "lng",
  logoUrl: "logo_url",
  bannerUrl: "banner_url",
  isOpen: "is_open",
  busyMode: "busy_mode",
  minOrderAmount: "min_order_amount",
  openingTime: "opening_time",
  closingTime: "closing_time",
  prepTimeMinutes: "prep_time_minutes",
  deliveryBaseKm: "delivery_base_km",
  deliveryBaseFee: "delivery_base_fee",
  deliveryPerKmFee: "delivery_per_km_fee",
  freeDeliveryMinAmount: "free_delivery_min_amount",
  paymentMethods: "payment_methods",
};

export function profileFromRow(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    phone: row.phone ?? "",
    addressLine: row.address_line ?? "",
    lat: row.lat,
    lng: row.lng,
    logoUrl: row.logo_url,
    bannerUrl: row.banner_url,
    isOpen: row.is_open,
    busyMode: row.busy_mode,
    minOrderAmount: Number(row.min_order_amount),
    openingTime: row.opening_time,
    closingTime: row.closing_time,
    prepTimeMinutes: row.prep_time_minutes,
    deliveryBaseKm: Number(row.delivery_base_km),
    deliveryBaseFee: Number(row.delivery_base_fee),
    deliveryPerKmFee: Number(row.delivery_per_km_fee),
    freeDeliveryMinAmount:
      row.free_delivery_min_amount == null ? null : Number(row.free_delivery_min_amount),
    paymentMethods: row.payment_methods ?? [],
    updatedAt: row.updated_at,
  };
}

function patchToRow(patch) {
  const row = {};
  for (const [key, column] of Object.entries(FIELD_MAP)) {
    if (patch[key] !== undefined) row[column] = patch[key];
  }
  return row;
}

export async function getRestaurantProfile(client = getSupabase()) {
  const { data, error } = await client.from("restaurant_profile").select("*").eq("id", 1).single();
  if (error) throw error;
  return profileFromRow(data);
}

export async function updateRestaurantProfile(patch, client = getSupabase()) {
  const { data, error } = await client
    .from("restaurant_profile")
    .update(patchToRow(patch))
    .eq("id", 1)
    .select()
    .single();
  if (error) throw error;
  return profileFromRow(data);
}
