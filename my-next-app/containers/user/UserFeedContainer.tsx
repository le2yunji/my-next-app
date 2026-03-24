// components/user/UserFeedContainer.tsx
import { Suspense } from "react";
import UserFeedSection from "@/features/users/ui/UserFeedSection";
import UserProfileSection from "@/features/users/ui/UserProfileSection";

export default async function UserFeedContainer({
  userId,
}: {
  userId: string;
}) {
  return (
    <>
      <UserProfileSection userId={userId} />

      <Suspense fallback={<div>피드 리스트 loading...</div>}>
        <UserFeedSection userId={userId} />
      </Suspense>
    </>
  );
}
