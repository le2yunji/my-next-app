"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/common/button/PrimaryButton";
import { SecondaryButton } from "@/components/common/button/SecondaryButton";

export default function FollowButton({
  initialIsFollowing,
}: {
  targetUserId: string;
  initialIsFollowing: boolean;
}) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

  const toggle = () => setIsFollowing((prev) => !prev);

  if (isFollowing) {
    return (
      <SecondaryButton
        onClick={toggle}
        ignoreSize
        className="h-8 rounded-md px-2.5 text-[12px] font-semibold sm:h-10 sm:px-4 sm:text-[14px]"
      >
        Unfollow
      </SecondaryButton>
    );
  }

  return (
    <PrimaryButton
      onClick={toggle}
      ignoreSize
      className="h-8 rounded-2xl bg-black px-2.5 text-[12px] font-semibold text-white sm:h-10 sm:px-4 sm:text-[14px]"
    >
      Follow
    </PrimaryButton>
  );
}
