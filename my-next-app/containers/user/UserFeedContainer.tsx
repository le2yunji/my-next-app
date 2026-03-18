import { getUserProfileAction } from "@/app/actions/users.action";
import UserProfile from "@/features/users/ui/UserProfile";
import { Suspense } from "react";
import UserFeedSection from "@/features/users/ui/UserFeedSection";

export default async function UserFeedContainer({
  userId,
}: {
  userId: string;
}) {
  const user = await getUserProfileAction({ userId });

  return (
    <>
      <UserProfile user={user} />

      <Suspense fallback={<div>피드 리스트 loading...</div>}>
        <UserFeedSection userId={userId} />
      </Suspense>
    </>
  );
}
