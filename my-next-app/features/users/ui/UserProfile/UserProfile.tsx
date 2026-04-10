import Image from "next/image";
import { UserProfileItem } from "@/features/users/types/user.type";

export default function UserProfile({
  user,
  isOwner,
}: {
  user: UserProfileItem;
  isOwner: boolean;
}) {
  return (
    <section className="px-5 pt-8 pb-6">
      <div className="flex items-start gap-5">
        {/* 프로필 이미지 */}
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-[5px] border-[#E9B088] bg-[#E5E7EB] shadow-sm">
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt={`${user.userId} 프로필 이미지`}
              fill
              className="object-cover"
              unoptimized
              sizes="112px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-[#9CA3AF]">
              No Image
            </div>
          )}
        </div>

        {/* 우측 정보 */}
        <div className="min-w-0 flex-1 pt-2">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-[22px] font-semibold leading-[1.2] text-[#111827]">
                {user.name}
              </h1>
              <p className="mt-1 text-[17px] font-medium text-[#6B7280]">
                @{user.userId}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {isOwner ? (
                <button
                  type="button"
                  className="h-10 rounded-2xl bg-black px-4 text-[14px] font-semibold text-white"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  className="h-10 rounded-2xl bg-black px-4 text-[14px] font-semibold text-white"
                >
                  Follow
                </button>
              )}

              <button
                type="button"
                aria-label="공유"
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white text-[#4B5563]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4.5 w-4.5"
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
              </button>
            </div>
          </div>

          {/* 통계 */}
          <div className="mt-6 flex items-center">
            <ProfileStat label="Posts" value={user.postCount} />
            <Divider />
            <ProfileStat label="Followers" value={user.followerCount} />
            <Divider />
            <ProfileStat label="Following" value={user.followingCount} />
          </div>
        </div>
      </div>

      {/* 소개 */}
      {user.bio ? (
        <p className="mt-7 max-w-[520px] text-[16px] leading-8 text-[#374151]">
          {user.bio}
        </p>
      ) : null}
    </section>
  );
}

function ProfileStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-[86px] text-center">
      <p className="text-[18px] font-semibold leading-6 text-[#111827]">
        {formatCount(value)}
      </p>
      <p className="mt-1 text-[14px] text-[#6B7280]">{label}</p>
    </div>
  );
}

function Divider() {
  return <div className="mx-3 h-14 w-px bg-[#E5E7EB]" />;
}

function formatCount(value: number) {
  if (value >= 1000) {
    const formatted = value / 1000;
    return `${Number.isInteger(formatted) ? formatted : formatted.toFixed(1)}k`;
  }

  return value.toString();
}
