"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Search,
  Bell,
  Bookmark,
  User,
  Settings,
  LucideIcon,
} from "lucide-react";
import { IconKey } from "./sidebarConfig";

const iconMap: Record<IconKey, LucideIcon> = {
  House,
  Search,
  Bell,
  Bookmark,
  User,
  Settings,
};

type Props = {
  href: string;
  label: string;
  icon: IconKey;
  variant?: "sidebar" | "bottom";
};

export default function SidebarItem({
  href,
  label,
  icon,
  variant = "sidebar",
}: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const Icon = iconMap[icon];

  if (variant === "bottom") {
    return (
      <Link
        href={href}
        className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors ${
          isActive ? "text-black" : "text-gray-400"
        }`}
      >
        <Icon size={26} strokeWidth={isActive ? 2 : 1.6} />
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors md:justify-center md:px-2 lg:justify-start lg:px-4 ${
        isActive ? "bg-black text-white" : "text-gray-600 hover:bg-linen"
      }`}
    >
      <Icon
        size={22}
        strokeWidth={1.6}
        className={isActive ? "text-white" : ""}
      />
      <span
        className={`hidden lg:block text-[15px] font-medium ${isActive ? "text-white" : ""}`}
      >
        {label}
      </span>
    </Link>
  );
}
