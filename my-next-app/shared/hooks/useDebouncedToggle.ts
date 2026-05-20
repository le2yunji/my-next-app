"use client";

import { useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type ToggleResult = { active: boolean } | { isError: true; message: string };

/**
 * 낙관적 업데이트 + 디바운스 + 롤백을 처리하는 범용 토글 훅
 * 좋아요, 팔로우 등 boolean 상태를 토글하는 모든 곳에서 재사용 가능
 */
export function useDebouncedToggle({
  initialActive,
  onToggle,
  delay = 400,
}: {
  initialActive: boolean;
  /** 디바운스 후 실행되는 비동기 토글 함수. 서버 확정 상태 반환 */
  onToggle: () => Promise<ToggleResult>;
  delay?: number;
}) {
  const [active, setActive] = useState(initialActive);

  // 서버에서 확인된 마지막 상태 (롤백 기준)
  const serverActiveRef = useRef(initialActive);
  // 스테일 클로저 방지: setTimeout 콜백이 최신 pending 상태를 읽도록 ref로 추적
  const pendingRef = useRef(initialActive);

  const debouncedToggle = useDebouncedCallback(async (next: boolean) => {
    // 짝수 번 클릭 → 서버 상태와 동일하므로 API 불필요
    if (next === serverActiveRef.current) return;

    const result = await onToggle();

    // API 호출 중 유저가 다시 클릭했으면 → pending 상태를 건드리지 않음
    // (이후 새 debounce가 올바른 상태로 API를 재호출)
    const clickedAgainDuringCall = pendingRef.current !== next;

    if ("isError" in result) {
      if (!clickedAgainDuringCall) {
        setActive(serverActiveRef.current);
        pendingRef.current = serverActiveRef.current;
      }
      return;
    }

    serverActiveRef.current = result.active;
    if (!clickedAgainDuringCall) {
      pendingRef.current = result.active;
      setActive(result.active);
    }
  }, delay);

  const toggle = () => {
    const next = !pendingRef.current;
    pendingRef.current = next;
    setActive(next);
    debouncedToggle(next);
  };

  return { active, toggle };
}
