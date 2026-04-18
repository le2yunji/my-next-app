// containers/user/UserFeedContainer.tsx
import { Suspense } from "react";

import ProfileTabs from "@/features/users/ui/ProfileTabs/ProfileTabs";
import { getMeServer } from "@/lib/auth/getMeServer";
import UserProfileSection from "@/features/users/ui/UserProfile/UserProfileSection";
import UserFeedSection from "@/features/users/ui/UserFeed/UserFeedSection";

export default async function UserFeedContainer({
  userId,
  tab = "boards",
}: {
  userId: string;
  tab?: string;
}) {
  const me = await getMeServer();
  const isOwner = me?.userId === userId;

  return (
    <>
      <UserProfileSection userId={userId} isOwner={isOwner} />

      <div className="px-5 mb-4">
        <ProfileTabs activeId={tab} />
      </div>

      <Suspense fallback={<div>피드 리스트 loading...</div>}>
        <UserFeedSection userId={userId} isOwner={isOwner} tab={tab} />
      </Suspense>
    </>
  );
}
