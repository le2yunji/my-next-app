/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Heart, MessageCircle, User, Bookmark } from "lucide-react";
import Image from "next/image";

type NotifType = "like" | "comment" | "follow" | "save";

type Notification = {
  id: string;
  type: NotifType;
  authorName: string;
  authorAvatar: string;
  text: string;
  time: string;
  postImgUrl: string | null;
  read: boolean;
};

// 백엔드 알림 API 연동 전까지 사용하는 mock 데이터
const MOCK_NOTIFS: Notification[] = [
  {
    id: "n1",
    type: "like",
    authorName: "haein_c",
    authorAvatar: "https://i.pravatar.cc/150?img=25",
    text: "회원님의 게시물을 좋아합니다.",
    time: "방금 전",
    postImgUrl: "https://picsum.photos/seed/mute1/80/80",
    read: false,
  },
  {
    id: "n2",
    type: "follow",
    authorName: "yujin_s",
    authorAvatar: "https://i.pravatar.cc/150?img=32",
    text: "회원님을 팔로우하기 시작했습니다.",
    time: "10분 전",
    postImgUrl: null,
    read: false,
  },
  {
    id: "n3",
    type: "comment",
    authorName: "sooyeon_l",
    authorAvatar: "https://i.pravatar.cc/150?img=44",
    text: '댓글: "너무 예뻐요! 어디예요?"',
    time: "1시간 전",
    postImgUrl: "https://picsum.photos/seed/mute2/80/80",
    read: false,
  },
  {
    id: "n4",
    type: "like",
    authorName: "minjun_k",
    authorAvatar: "https://i.pravatar.cc/150?img=11",
    text: "회원님의 게시물을 좋아합니다.",
    time: "3시간 전",
    postImgUrl: "https://picsum.photos/seed/mute3/80/80",
    read: true,
  },
  {
    id: "n5",
    type: "save",
    authorName: "junho_p",
    authorAvatar: "https://i.pravatar.cc/150?img=67",
    text: "회원님의 게시물을 저장했습니다.",
    time: "1일 전",
    postImgUrl: "https://picsum.photos/seed/mute4/80/80",
    read: true,
  },
  {
    id: "n6",
    type: "follow",
    authorName: "haein_c",
    authorAvatar: "https://i.pravatar.cc/150?img=25",
    text: "회원님을 팔로우하기 시작했습니다.",
    time: "2일 전",
    postImgUrl: null,
    read: true,
  },
];

const NOTIF_ICON: Record<
  NotifType,
  { Icon: React.ElementType; color: string }
> = {
  like: { Icon: Heart, color: "bg-red" },
  comment: { Icon: MessageCircle, color: "bg-slate" },
  follow: { Icon: User, color: "bg-sand" },
  save: { Icon: Bookmark, color: "bg-cool-gray" },
};

function NotifItem({ notif }: { notif: Notification }) {
  const { Icon, color } = NOTIF_ICON[notif.type];

  return (
    <div
      className={`flex items-center gap-3 border-b border-linen px-5 py-3 ${
        notif.read ? "" : "bg-near-black/3"
      }`}
    >
      {/* 아바타 + 타입 뱃지 */}
      <div className="relative shrink-0">
        <Image
          src={notif.authorAvatar}
          alt={notif.authorName}
          width={44}
          height={44}
          className="h-11 w-11 rounded-full object-cover"
        />
        <span
          className={`absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-warm-white ${color}`}
        >
          <Icon size={10} strokeWidth={2} className="text-white" />
        </span>
      </div>

      {/* 텍스트 */}
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] leading-snug">
          <span className="font-semibold">{notif.authorName}</span>{" "}
          <span className="text-slate">{notif.text}</span>
        </p>
        <p className="mt-0.5 text-[11px] text-silver">{notif.time}</p>
      </div>

      {/* 게시물 썸네일 */}
      {notif.postImgUrl && (
        <Image
          src={notif.postImgUrl}
          alt=""
          width={44}
          height={44}
          className="shrink-0 rounded-lg object-cover"
          unoptimized
        />
      )}

      {/* 읽지 않은 표시 */}
      {!notif.read && (
        <span className="h-2 w-2 shrink-0 rounded-full bg-near-black" />
      )}
    </div>
  );
}

export default function NotificationList() {
  const [notifs, setNotifs] = useState<Notification[]>(MOCK_NOTIFS);

  const unread = notifs.filter((n) => !n.read);
  const read = notifs.filter((n) => n.read);

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="mx-auto max-w-lg pb-20 pt-6">
      {/* 헤더 */}
      <div className="mb-5 flex items-center justify-between px-5">
        <h1 className="text-xl font-bold">알림</h1>
        {unread.length > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="text-[13px] text-cool-gray hover:text-near-black"
          >
            모두 읽음
          </button>
        )}
      </div>

      {/* 새 알림 */}
      {unread.length > 0 && (
        <section className="mb-4">
          <p className="px-5 pb-2.5 text-[12px] font-semibold uppercase tracking-wide text-silver">
            새로운 알림
          </p>
          {unread.map((n) => (
            <NotifItem key={n.id} notif={n} />
          ))}
        </section>
      )}

      {/* 이전 알림 */}
      {read.length > 0 && (
        <section>
          <p className="px-5 pb-2.5 text-[12px] font-semibold uppercase tracking-wide text-silver">
            이전 알림
          </p>
          {read.map((n) => (
            <NotifItem key={n.id} notif={n} />
          ))}
        </section>
      )}

      {notifs.length === 0 && (
        <p className="py-20 text-center text-sm text-silver">
          알림이 없습니다.
        </p>
      )}
    </div>
  );
}
