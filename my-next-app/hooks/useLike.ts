"use client";

import { useState } from "react";
import { useDebouncedToggle } from "./useDebouncedToggle";

type LikeResult =
  | { liked: boolean; likeCount: number }
  | { isError: true; message: string };

export function useLike({
  initialLiked,
  initialLikeCount,
  onToggle,
}: {
  initialLiked: boolean;
  initialLikeCount: number;
  /** 좋아요 토글 API 호출 함수. 서버 확정 상태 반환 */
  onToggle: () => Promise<LikeResult>;
}) {
  // 서버 확정 카운트/liked를 state로 관리 (render 중 ref 접근 금지)
  const [serverLikeCount, setServerLikeCount] = useState(initialLikeCount);
  const [serverLiked, setServerLiked] = useState(initialLiked);

  const { active: liked, toggle: handleLike } = useDebouncedToggle({
    initialActive: initialLiked,
    onToggle: async () => {
      const result = await onToggle();
      if ("isError" in result) return result;
      setServerLikeCount(result.likeCount);
      setServerLiked(result.liked);
      return { active: result.liked };
    },
  });

  // 서버 확정 카운트 + 낙관적 상태의 차이로 표시 카운트 계산
  const likeCount =
    serverLikeCount + (liked !== serverLiked ? (liked ? 1 : -1) : 0);

  return { liked, likeCount, handleLike };
}
