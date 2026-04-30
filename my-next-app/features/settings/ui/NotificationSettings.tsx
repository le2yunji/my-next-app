"use client";

import { useState, useEffect, useTransition } from "react";
import {
  getNotificationPreferencesAction,
  updateNotificationPreferencesAction,
} from "@/app/actions/notifications.action";
import {
  type NotificationType,
  NOTIFICATION_LABEL,
} from "@/features/notifications/types/notification.type";

// 설정 페이지에 표시할 알림 타입 순서 — 추가/제거 시 여기만 수정
const PREF_TYPES: NotificationType[] = [
  "COMMENT_LIKE",
  "COMMENT_REPLY",
  "POST_COMMENT",
  "FOLLOW",
  "POST_LIKE",
  "BOARD_LIKE",
  "POST_SCRAP",
];

export default function NotificationSettings() {
  // 타입별 수신 여부 { POST_LIKE: true, FOLLOW: false, ... }
  const [prefs, setPrefs] = useState<
    Partial<Record<NotificationType, boolean>>
  >({});
  // 로드 전 빈 화면 방지용 — 데이터 오기 전에는 아무것도 렌더링하지 않음
  const [isLoaded, setIsLoaded] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    getNotificationPreferencesAction().then((res) => {
      if (!res.isError) setPrefs(res.preferences ?? {});
      setIsLoaded(true);
    });
  }, []);

  const toggle = (type: NotificationType) => {
    const next = !prefs[type];
    // 로컬 상태 즉시 반영 후 서버에 비동기 업데이트 (낙관적 업데이트)
    setPrefs((prev) => ({ ...prev, [type]: next }));
    startTransition(async () => {
      await updateNotificationPreferencesAction({ [type]: next });
    });
  };

  if (!isLoaded) return null;

  return (
    <div className="mt-6">
      <h2 className="mb-3 text-sm font-semibold text-near-black">
        알림 수신 설정
      </h2>
      <ul className="divide-y divide-linen rounded-xl border border-linen">
        {PREF_TYPES.map((type) => (
          <li
            key={type}
            className="flex items-center justify-between px-4 py-3"
          >
            <span className="text-sm text-near-black">
              {NOTIFICATION_LABEL[type]}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={!!prefs[type]}
              onClick={() => toggle(type)}
              className={`relative h-6 w-10 rounded-full transition-colors ${
                prefs[type] ? "bg-near-black" : "bg-silver"
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  prefs[type] ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
