import Link from "next/link";
import {
  MdChevronRight,
  MdOutlineTwoWheeler,
  MdOutlinePointOfSale,
  MdOutlineGridView,
  MdLogout,
} from "react-icons/md";
import Card from "@/components/owner/Card";
import { useOwnerAuth } from "@/context/OwnerAuthContext";

export default function TeamLinksCard() {
  const { signOut } = useOwnerAuth();

  return (
    <Card className="p-0">
      <Link href="/profile/categories" className="flex items-center gap-3 px-4 py-3.5">
        <MdOutlineGridView size={20} className="text-muted" />
        <span className="flex-1 text-sm text-ink">Home categories</span>
        <MdChevronRight className="text-muted" size={20} />
      </Link>
      <div className="border-t border-line" />
      <Link href="/profile/riders" className="flex items-center gap-3 px-4 py-3.5">
        <MdOutlineTwoWheeler size={20} className="text-muted" />
        <span className="flex-1 text-sm text-ink">Delivery riders</span>
        <MdChevronRight className="text-muted" size={20} />
      </Link>
      <div className="border-t border-line" />
      <Link href="/profile/billing-counters" className="flex items-center gap-3 px-4 py-3.5">
        <MdOutlinePointOfSale size={20} className="text-muted" />
        <span className="flex-1 text-sm text-ink">Billing counter logins</span>
        <MdChevronRight className="text-muted" size={20} />
      </Link>
      <div className="border-t border-line" />
      <button onClick={signOut} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
        <MdLogout size={20} className="text-danger" />
        <span className="flex-1 text-sm text-danger">Sign out</span>
      </button>
    </Card>
  );
}
