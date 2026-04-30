"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { TYPE_ICON } from "@/features/notifications/constants/notification.icon";
import {
  type NotificationItem,
  NOTIFICATION_TEXT,
} from "@/features/notifications/types/notification.type";
import { formatRelativeTime } from "@/features/comments/utils/formatRelativeTime";

export function NotifItem({
  notif,
  onRead,
}: {
  notif: NotificationItem;
  onRead: (id: string) => void;
}) {
  const { Icon, bg } = TYPE_ICON[notif.type] ?? { Icon: User, bg: "bg-silver" };
  const profileImage = notif.sender?.profileImage ?? null;

  return (
    <div
      onClick={() => !notif.isRead && onRead(notif.id)}
      className={`flex cursor-pointer items-center gap-3 border-b border-linen px-5 py-3 transition-colors hover:bg-linen/50 ${
        notif.isRead ? "" : "bg-near-black/3"
      }`}
    >
      {/* 아바타 + 타입 뱃지 */}
      <div className="relative shrink-0">
        {profileImage ? (
          <Image
            src={profileImage}
            alt={notif.sender?.userId ?? ""}
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-linen">
            <User size={20} className="text-silver" />
          </div>
        )}
        <span
          className={`absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-warm-white ${bg}`}
        >
          <Icon size={10} strokeWidth={2} className="text-white" />
        </span>
      </div>

      {/* 텍스트 */}
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] leading-snug">
          <span className="font-semibold">
            {notif.sender?.userId ?? "알 수 없음"}
          </span>{" "}
          <span className="text-cool-gray">
            {NOTIFICATION_TEXT[notif.type]}
          </span>
        </p>
        <p className="mt-0.5 text-[11px] text-silver">
          {formatRelativeTime(notif.createdAt)}
        </p>
      </div>

      {/* 미읽음 표시 */}
      {!notif.isRead && (
        <span className="h-2 w-2 shrink-0 rounded-full bg-near-black" />
      )}
    </div>
  );
}
