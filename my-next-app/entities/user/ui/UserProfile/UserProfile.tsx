"use client";

import { type UserProfileItem } from "@/entities/user";
import { SecondaryButton } from "@/shared/ui/button/SecondaryButton";
import { FollowButton } from "@/features/toggle-follow-user";
import Avatar from "@/shared/ui/Avatar";
import { PrimaryButton } from "@/shared/ui/button/PrimaryButton";
import Badge from "@/shared/ui/Badge";
import { useRouter } from "next/navigation";

export default function UserProfile({
  user,
  isOwner,
}: {
  user: UserProfileItem;
  isOwner: boolean;
}) {
  const router = useRouter();
  return (
    <section className="px-4 pt-5 pb-6 sm:px-5 sm:pt-8">
      <div className="flex items-start gap-3 sm:gap-5">
        {/* 프로필 이미지: 기본 lg → sm:xl → md:2xl */}
        <Avatar
          src={user.profileImage}
          alt={`${user.userId} 프로필 이미지`}
          size="xxl"
          className="h-16 w-16 shadow-sm sm:h-20 sm:w-20 md:h-28 md:w-28"
        />

        {/* 우측 정보 */}
        <div className="min-w-0 flex-1 pt-1 sm:pt-2">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-[17px] font-semibold leading-[1.2] text-[#111827] sm:text-[22px]">
                {user.userId}
              </h1>
              <p className="mt-0.5 text-[13px] font-medium text-[#6B7280] sm:mt-1 sm:text-[17px]">
                {user.name}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              {isOwner ? (
                <PrimaryButton
                  className="h-8 rounded-md bg-black px-2.5 text-[12px] font-semibold text-white sm:h-10 sm:px-4 sm:text-[14px]"
                  onClick={() => router.push("/settings/profile")}
                >
                  Edit Profile
                </PrimaryButton>
              ) : (
                <FollowButton
                  targetUserId={user.userId}
                  initialIsFollowing={user.isFollowing}
                />
              )}

              <SecondaryButton
                ignoreSize
                aria-label="공유"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#E5E7EB] bg-white text-[#4B5563] sm:h-10 sm:w-10"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 sm:h-4.5 sm:w-4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="18" cy="5" r="2.2" />
                  <circle cx="6" cy="12" r="2.2" />
                  <circle cx="18" cy="19" r="2.2" />
                  <path d="M8 11l7.6-4.3" />
                  <path d="M8 13l7.6 4.3" />
                </svg>
              </SecondaryButton>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 sm:mt-6 sm:gap-3">
            <ProfileStat label="게시물" value={user.postCount} />
            <ProfileStat label="팔로워" value={user.followerCount} />
            <ProfileStat label="팔로잉" value={user.followingCount} />
          </div>
        </div>
      </div>

      {/* 소개 */}
      {user.bio ? (
        <p className="mt-5 max-w-130 text-[14px] leading-7 text-[#374151] sm:mt-7 sm:text-[16px] sm:leading-8">
          {user.bio}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-1.5 sm:mt-7">
        {user.interestCategories
          ? user.interestCategories.map((category) => (
              <Badge key={category}>{category}</Badge>
            ))
          : null}
        {user.customInterestCategories
          ? user.customInterestCategories.map((category) => (
              <Badge key={category}>{category}</Badge>
            ))
          : null}
      </div>
    </section>
  );
}

function ProfileStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex gap-0.5 items-center sm:gap-1">
      <p className="text-[12px] text-[#6B7280] sm:text-[14px] md:text-[16px]">
        {label}
      </p>
      <p className="text-[12px] font-semibold leading-6 text-[#111827] sm:text-[14px] md:text-[16px]">
        {formatCount(value)}
      </p>
    </div>
  );
}

function formatCount(value?: number | null) {
  if (value == null) {
    return "0";
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value.toString();
}
