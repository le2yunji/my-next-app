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
};

export default function SidebarItem({ href, label, icon }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const Icon = iconMap[icon];

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 rounded-lg px-4 py-3 transition-colors
        ${
          isActive
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        }
      `}
    >
      <Icon
        size={20}
        strokeWidth={1.6}
        className={`${isActive ? "text-white" : ""}`}
      />
      <span
        className={`text-[15px] font-medium ${isActive ? "text-white" : ""}`}
      >
        {label}
      </span>
    </Link>
  );
}
