"use client";

import { useEffect, useRef, useState } from "react";

type Options = IntersectionObserverInit & {
  enabled?: boolean; // 관측 on/off
};

export function useIntersectionObserver({
  root = null,
  rootMargin = "0px",
  threshold = 0,
  enabled = true,
}: Options = {}) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsIntersecting(false);
      return;
    }

    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsIntersecting(Boolean(entry?.isIntersecting));
      },
      { root, rootMargin, threshold }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold, enabled]);

  return { sentinelRef, isIntersecting };
}
