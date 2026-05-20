"use client";

import { useState } from "react";
import { PrimaryButton } from "@/shared/ui/button/PrimaryButton";
import { SecondaryButton } from "@/shared/ui/button/SecondaryButton";

type FollowButtonSize = "sm" | "md" | "lg";

/** size별 height·padding·font 클래스 */
const sizeClasses: Record<FollowButtonSize, string> = {
  sm: "h-7 px-2 rounded-md text-[12px] font-semibold",
  md: "h-8 px-2.5 text-[12px] font-semibold sm:h-10 sm:px-4 sm:text-[14px]",
  lg: "h-10 px-4 text-[14px] font-semibold sm:h-12 sm:px-6 sm:text-[16px]",
};

/**
 * 특정 유저를 팔로우/언팔로우할 수 있는 토글 버튼 컴포넌트.
 *
 * - 팔로우 상태면 `SecondaryButton("Unfollow")` 렌더링
 * - 미팔로우 상태면 `PrimaryButton("Follow")` 렌더링
 *
 * @param targetUserId - 팔로우 대상 유저의 ID (API 호출 시 사용 예정)
 * @param initialIsFollowing - 초기 팔로우 여부 (서버에서 내려온 값)
 * @param size - 버튼 크기. `"sm"` | `"md"` | `"lg"` (기본값: `"md"`)
 *
 * @example
 * ```tsx
 * // 기본 사이즈
 * <FollowButton targetUserId="abc123" initialIsFollowing={false} />
 *
 * // 작은 사이즈 (팔로워 목록 등)
 * <FollowButton targetUserId="abc123" initialIsFollowing={true} size="sm" />
 *
 * // 큰 사이즈 (프로필 헤더 등)
 * <FollowButton targetUserId="abc123" initialIsFollowing={false} size="lg" />
 * ```
 */
export default function FollowButton({
  initialIsFollowing,
  size = "md",
}: {
  targetUserId: string;
  initialIsFollowing: boolean;
  size?: FollowButtonSize;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const toggle = () => setIsFollowing((prev) => !prev);

  if (isFollowing) {
    return (
      <SecondaryButton
        onClick={toggle}
        ignoreSize
        className={`rounded-md ${sizeClasses[size]}`}
      >
        Unfollow
      </SecondaryButton>
    );
  }

  return (
    <PrimaryButton
      onClick={toggle}
      ignoreSize
      className={`rounded-2xl bg-black text-white ${sizeClasses[size]}`}
    >
      Follow
    </PrimaryButton>
  );
}
