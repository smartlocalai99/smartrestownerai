import Link from "next/link";
import { useRouter } from "next/router";
import { MdOutlineDashboard, MdOutlineRestaurantMenu, MdOutlineLocalOffer, MdOutlinePerson } from "react-icons/md";

const TABS = [
  { href: "/dashboard", label: "Dashboard", Icon: MdOutlineDashboard },
  { href: "/menu", label: "Menu", Icon: MdOutlineRestaurantMenu },
  { href: "/offers", label: "Offers", Icon: MdOutlineLocalOffer },
  { href: "/profile", label: "Profile", Icon: MdOutlinePerson },
];

export default function BottomNav() {
  const router = useRouter();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 safe-bottom">
      <div className="mx-auto flex max-w-md items-stretch justify-between gap-1 border-t border-line bg-surface/95 px-2 pb-1 pt-2 backdrop-blur-md">
        {TABS.map(({ href, label, Icon }) => {
          const isActive = router.pathname === href || router.pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 transition-colors"
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  isActive ? "bg-accent text-canvas" : "text-muted"
                }`}
              >
                <Icon size={20} />
              </span>
              <span className={`text-[11px] font-medium ${isActive ? "text-ink" : "text-muted"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
