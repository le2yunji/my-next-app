// components/user/UserFeedContainer.tsx
import { Suspense } from "react";
import UserFeedSection from "@/features/users/ui/UserFeed/UserFeedSection";
import UserProfileSection from "@/features/users/ui/UserProfileSection";
import { getMeServer } from "@/lib/auth/getMeServer";

export default async function UserFeedContainer({
  userId,
}: {
  userId: string;
}) {
  const me = await getMeServer();
  const isOwner = me?.id === userId;

  return (
    <>
      <UserProfileSection userId={userId} isOwner={isOwner} me={me} />

      <Suspense fallback={<div>피드 리스트 loading...</div>}>
        <UserFeedSection userId={userId} isOwner={isOwner} me={me} />
      </Suspense>
    </>
  );
}
