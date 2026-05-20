"use client";

import { useCallback, useState } from "react";
import { useDebouncedToggle } from "./useDebouncedToggle";

type ToggleCountResult =
  | { active: boolean; count: number }
  | { isError: true; message: string };

export function useOptimisticToggleCount({
  initialActive,
  initialCount,
  onToggle,
  canToggle = true,
  onBlocked,
}: {
  initialActive: boolean;
  initialCount: number;
  onToggle: () => Promise<ToggleCountResult>;
  /** false면 토글 자체를 실행하지 않음 */
  canToggle?: boolean;
  /** canToggle이 false일 때 실행할 함수 */
  onBlocked?: () => void;
}) {
  const [serverCount, setServerCount] = useState(initialCount);
  const [serverActive, setServerActive] = useState(initialActive);

  const { active, toggle } = useDebouncedToggle({
    initialActive,
    onToggle: async () => {
      const result = await onToggle();
      if ("isError" in result) return result;
      setServerCount(result.count);
      setServerActive(result.active);
      return { active: result.active };
    },
  });

  const guardedToggle = useCallback(() => {
    if (!canToggle) {
      onBlocked?.();
      return;
    }

    toggle();
  }, [canToggle, onBlocked, toggle]);
  const count = serverCount + (active !== serverActive ? (active ? 1 : -1) : 0);

  return {
    active,
    count,
    toggle: guardedToggle,
  };
}
