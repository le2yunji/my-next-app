"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

type Options = IntersectionObserverInit & {
  enabled?: boolean;
  /** 요소가 뷰포트에 진입할 때 호출되는 콜백 */
  onIntersect: () => void;
};

export function useIntersectionObserver({
  root = null,
  rootMargin = "0px",
  threshold = 0,
  enabled = true,
  onIntersect,
}: Options) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  // 스테일 클로저 방지: Observer 콜백이 항상 최신 onIntersect를 참조
  const onIntersectRef = useRef(onIntersect);
  // render 중 ref 쓰기 금지 → paint 전 동기 실행되는 useLayoutEffect로 갱신
  useLayoutEffect(() => {
    onIntersectRef.current = onIntersect;
  });

  useEffect(() => {
    if (!enabled) return;

    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Observer 콜백은 외부 시스템 이벤트이므로 setState 호출 허용
        if (entries[0]?.isIntersecting) {
          onIntersectRef.current();
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [root, rootMargin, threshold, enabled]);

  return { sentinelRef };
}
