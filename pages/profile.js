import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import AppShell from "@/components/owner/AppShell";
import PageHeader from "@/components/owner/PageHeader";
import IdentityCard from "@/components/owner/profile/IdentityCard";
import HoursCard from "@/components/owner/profile/HoursCard";
import OrderingRulesCard from "@/components/owner/profile/OrderingRulesCard";
import DeliveryPricingCard from "@/components/owner/profile/DeliveryPricingCard";
import PaymentMethodsCard from "@/components/owner/profile/PaymentMethodsCard";
import CancellationReasonsCard from "@/components/owner/profile/CancellationReasonsCard";
import TeamLinksCard from "@/components/owner/profile/TeamLinksCard";
import { getRestaurantProfile, updateRestaurantProfile } from "@/lib/restaurantProfile.mjs";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);

  const refresh = useCallback(() => getRestaurantProfile().then(setProfile).catch(() => {}), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleSave(patch) {
    const updated = await updateRestaurantProfile(patch);
    setProfile(updated);
  }

  return (
    <AppShell>
      <Head>
        <title>Profile — Mandi Kings Owner</title>
      </Head>

      <PageHeader eyebrow="Manage" title="Profile" />

      <div className="flex flex-col gap-4 px-5">
        {profile ? (
          <>
            <IdentityCard profile={profile} onSave={handleSave} />
            <HoursCard profile={profile} onSave={handleSave} />
            <OrderingRulesCard profile={profile} onSave={handleSave} />
            <DeliveryPricingCard profile={profile} onSave={handleSave} />
            <PaymentMethodsCard profile={profile} onSave={handleSave} />
            <CancellationReasonsCard />
            <TeamLinksCard />
          </>
        ) : (
          <p className="py-8 text-center text-sm text-muted">Loading profile…</p>
        )}
      </div>
    </AppShell>
  );
}
