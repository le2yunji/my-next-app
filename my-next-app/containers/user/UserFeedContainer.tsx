import { getUserProfileAction } from "@/app/actions/users.action";
import UserProfile from "@/features/users/ui/UserProfile";
import { Suspense } from "react";
import UserFeedSection from "@/features/users/ui/UserFeedSection";

export default async function UserFeedContainer({
  userId,
}: {
  userId: string;
}) {
  const userPromise = getUserProfileAction({ userId });

  return (
    <>
      <Suspense fallback={<div>프로필 loading...</div>}>
        <UserProfile userPromise={userPromise} />
      </Suspense>

      <Suspense fallback={<div>피드 리스트 loading...</div>}>
        <UserFeedSection userId={userId} />
      </Suspense>
    </>
  );
}
