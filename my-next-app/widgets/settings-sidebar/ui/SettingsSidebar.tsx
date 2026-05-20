import Link from "next/link";
import { Bell, LockKeyhole, UserPen } from "lucide-react";

const SETTINGS_NAV_ITEMS = [
  {
    label: "계정",
    href: "/settings/account",
    Icon: LockKeyhole,
  },
  {
    label: "프로필 편집",
    href: "/settings/profile",
    Icon: UserPen,
  },
  {
    label: "알림",
    href: "/settings/notifications",
    Icon: Bell,
  },
];

export default function SettingsSidebar() {
  return (
    <div className="px-5 py-10">
      <h1 className="mb-6 text-xl font-bold">설정</h1>
      <nav aria-label="설정 메뉴">
        <ul className="space-y-1">
          {SETTINGS_NAV_ITEMS.map(({ label, href, Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-near-black transition-colors hover:bg-linen"
              >
                <Icon size={18} strokeWidth={2} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
