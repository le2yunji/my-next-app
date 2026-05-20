// widgets/user-feed/ui/UserFeedWidget.tsx
import { Suspense } from "react";
import ProfileTabs from "@/entities/user/ui/ProfileTabs/ProfileTabs";
import { getMeServer } from "@/entities/session/api/getMeServer";
import UserProfileSection from "@/entities/user/ui/UserProfile/UserProfileSection";
import UserFeedSection from "@/features/feeds/ui/UserFeedSection";

export default async function UserFeedWidget({
  userId,
  tab = "boards",
}: {
  userId: string;
  tab?: string;
}) {
  const me = await getMeServer();
  const isOwner = me?.userId === userId;

  return (
    <div className="px-2 md:px-10 ">
      <UserProfileSection userId={userId} isOwner={isOwner} />

      <div className="px-5 mb-4">
        <ProfileTabs activeId={tab} />
      </div>

      <Suspense fallback={<div>피드 리스트 loading...</div>}>
        <UserFeedSection userId={userId} isOwner={isOwner} tab={tab} />
      </Suspense>
    </div>
  );
}
