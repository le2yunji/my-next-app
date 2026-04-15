// containers/user/UserFeedContainer.tsx
import { Suspense } from "react";
import UserFeedSection from "@/features/users/ui/UserFeed/UserFeedSection";
import UserProfileSection from "@/features/users/ui/UserProfile/UserProfileSection";
import ProfileTabs from "@/features/users/ui/ProfileTabs/ProfileTabs";
import { getMeServer } from "@/lib/auth/getMeServer";

export default async function UserFeedContainer({
  userId,
  tab = "boards",
}: {
  userId: string;
  tab?: string;
}) {
  const me = await getMeServer();
  const isOwner = me?.id === userId;

  return (
    <>
      <UserProfileSection userId={userId} isOwner={isOwner} me={me} />

      <div className="px-5 mb-4">
        <ProfileTabs activeId={tab} />
      </div>

      <Suspense fallback={<div>피드 리스트 loading...</div>}>
        <UserFeedSection userId={userId} isOwner={isOwner} tab={tab} />
      </Suspense>
    </>
  );
}
