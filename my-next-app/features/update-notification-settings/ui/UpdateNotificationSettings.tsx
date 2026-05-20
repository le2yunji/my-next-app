/**
 * UpdateNotificationSettings
→ feature의 public component
→ 상태 관리, 조회/수정 액션 처리
 * 
 */

"use client";

import { useEffect, useState, useTransition } from "react";

import {
  getNotificationPreferencesAction,
  updateNotificationPreferencesAction,
} from "@/app/actions/notifications.action";

import { NotificationPreferenceList } from "./NotificationPreferenceList";
import { NotificationType } from "@/entities/notification";

export function UpdateNotificationSettings() {
  const [prefs, setPrefs] = useState<
    Partial<Record<NotificationType, boolean>>
  >({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    getNotificationPreferencesAction().then((res) => {
      if (!res.isError) {
        setPrefs(res.preferences ?? {});
      }

      setIsLoaded(true);
    });
  }, []);

  const handleToggle = (type: NotificationType) => {
    const prevValue = !!prefs[type];
    const nextValue = !prevValue;

    setPrefs((prev) => ({
      ...prev,
      [type]: nextValue,
    }));
    startTransition(async () => {
      const res = await updateNotificationPreferencesAction({
        [type]: nextValue,
      });

      console.log(res);

      //   if (!res.ok) {
      //     setPrefs((prev) => ({
      //       ...prev,
      //       [type]: prevValue,
      //     }));
      //   }
    });
  };

  if (!isLoaded) return null;

  return <NotificationPreferenceList prefs={prefs} onToggle={handleToggle} />;
}
