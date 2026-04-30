"use client";

import { useCallback, useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

type CursorPageResult<T> = {
  items: T[];
  nextCursor: string | null;
  hasNext: boolean;
};

type UseInfiniteScrollListParams<T> = {
  initialItems: T[]; // 첫 렌더에 받아온 초기 목록
  initialCursor: string | null; // 초기 목록 다음 이어서 불러올 커서
  initialHasNext: boolean;
  limit: number;
  getKey: (item: T) => string; // 중복 제거용 키를 뽑는 함수
  fetchPage: (params: {
    // 다음 페이지를 가져오는 함수
    cursor: string | null;
    limit: number;
  }) => Promise<CursorPageResult<T>>;
  errorMessage?: string;
  rootMargin?: string;
  threshold?: IntersectionObserverInit["threshold"];
};

export function useInfiniteScrollList<T>({
  initialItems,
  initialCursor,
  initialHasNext,
  limit,
  getKey,
  fetchPage,
  errorMessage = "목록을 불러오지 못했습니다.",
  rootMargin = "200px",
  threshold = 0,
}: UseInfiniteScrollListParams<T>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasNext, setHasNext] = useState(initialHasNext);

  const fetchNext = useCallback(async () => {
    if (!hasNext || loading) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const data = await fetchPage({ cursor, limit });

      setItems((prev) => {
        const seen = new Set(prev.map(getKey));
        const merged = [...prev];

        for (const item of data.items) {
          const key = getKey(item);
          if (!seen.has(key)) {
            seen.add(key);
            merged.push(item);
          }
        }

        return merged;
      });

      setCursor(data.nextCursor);
      setHasNext(data.hasNext);
    } catch {
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [cursor, fetchPage, getKey, hasNext, limit, loading, errorMessage]);

  const { sentinelRef } = useIntersectionObserver({
    enabled: hasNext && !loading,
    rootMargin,
    threshold,
    onIntersect: fetchNext,
  });

  return {
    items,
    loading,
    errorMsg,
    hasNext,
    cursor,
    sentinelRef,
    fetchNext,
    setItems,
  };
}
