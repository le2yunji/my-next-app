"use client";

import { useNotificationStore } from "@/stores/notification.store";
import SidebarItem from "./SidebarItem";
import { sidebarItems } from "./sidebarConfig";

type Props = {
  variant?: "sidebar" | "bottom";
};

export default function SidebarNav({ variant = "sidebar" }: Props) {
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <>
      {sidebarItems.map((item) => (
        <SidebarItem
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          variant={variant}
          authRequired={item.authRequired}
          badge={item.icon === "Bell" ? unreadCount : undefined}
        />
      ))}
    </>
  );
}
