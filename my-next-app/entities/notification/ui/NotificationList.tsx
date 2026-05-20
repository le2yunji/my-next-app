"use client";

import { useEffect, useTransition, useCallback } from "react";
import {
  getNotificationsAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from "@/app/actions/notifications.action";

import { useInfiniteScrollList } from "@/shared/hooks/useInfiniteScrollList";
import {
  NotificationItem,
  NotificationItemType,
  useNotificationStore,
} from "@/entities/notification";

const PAGE_SIZE = 20;

type Props = {
  initialItems: NotificationItemType[];
  initialCursor: string | null;
  initialHasNext: boolean;
};

export function NotificationList({
  initialItems,
  initialCursor,
  initialHasNext,
}: Props) {
  const resetUnread = useNotificationStore((s) => s.resetUnread);
  const [isPending, startTransition] = useTransition();

  // getNotificationsAction 응답을 훅의 CursorPageResult 형태로 변환
  const fetchPage = useCallback(
    async ({ cursor, limit }: { cursor: string | null; limit: number }) => {
      const res = await getNotificationsAction({ cursor, limit });
      if (res.isError) throw new Error(res.message);
      return {
        items: res.items as NotificationItemType[],
        nextCursor: res.nextCursor ?? null,
        hasNext: res.hasNext ?? false,
      };
    },
    [],
  );

  const { items, loading, sentinelRef, setItems } = useInfiniteScrollList({
    initialItems,
    initialCursor,
    initialHasNext,
    limit: PAGE_SIZE,
    getKey: (n) => n.id,
    fetchPage,
  });

  // 페이지 진입 시 사이드바 뱃지 초기화 (resetUnread는 Zustand 안정적 setter)
  useEffect(() => {
    resetUnread();
  }, [resetUnread]);

  const handleMarkAllRead = () => {
    startTransition(async () => {
      await markAllNotificationsReadAction();
      // 낙관적 업데이트
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    });
  };

  const handleRead = (id: string) => {
    startTransition(async () => {
      await markNotificationReadAction(id);
      // 해당 알림만 읽음으로 변경
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    });
  };

  // 읽음/미읽음 분리해서 섹션별로 렌더링
  const unread = items.filter((n) => !n.isRead);
  const read = items.filter((n) => n.isRead);

  return (
    <div className="mx-auto max-w-lg pb-20 pt-6">
      {/* 헤더 */}
      <div className="mb-5 flex items-center justify-between px-5">
        <h1 className="text-xl font-bold">알림</h1>
        {unread.length > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={isPending}
            className="text-[13px] text-cool-gray hover:text-near-black disabled:opacity-50"
          >
            모두 읽음
          </button>
        )}
      </div>

      {items.length === 0 && !loading ? (
        <p className="py-20 text-center text-sm text-silver">
          알림이 없습니다.
        </p>
      ) : (
        <>
          {/* 새 알림 */}
          {unread.length > 0 && (
            <section className="mb-4">
              <p className="px-5 pb-2.5 text-[12px] font-semibold uppercase tracking-wide text-silver">
                새로운 알림
              </p>
              {unread.map((n) => (
                <NotificationItem key={n.id} notif={n} onRead={handleRead} />
              ))}
            </section>
          )}

          {/* 이전 알림 */}
          {read.length > 0 && (
            <section>
              {unread.length > 0 && (
                <p className="px-5 pb-2.5 text-[12px] font-semibold uppercase tracking-wide text-silver">
                  이전 알림
                </p>
              )}
              {read.map((n) => (
                <NotificationItem key={n.id} notif={n} onRead={handleRead} />
              ))}
            </section>
          )}

          {/* 무한스크롤 센티널 — 이 요소가 뷰포트에 들어오면 다음 페이지 로드 */}
          <div ref={sentinelRef} className="py-4 text-center">
            {loading && <p className="text-sm text-silver">불러오는 중...</p>}
          </div>
        </>
      )}
    </div>
  );
}
