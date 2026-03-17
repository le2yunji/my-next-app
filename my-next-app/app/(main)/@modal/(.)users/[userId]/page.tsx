// app/(main)/@modal/(.)users/[userId]/page.tsx
import { getUserFeedAction } from "@/app/actions/users.action";
import UserFeedContainer from "@/containers/user/UserFeedContainer";
import UserFeedModal from "@/containers/user/UserFeedModal";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const initialFeed = await getUserFeedAction({ userId, limit: 9 });

  return (
    <UserFeedModal>
      <UserFeedContainer userId={userId} initialFeed={initialFeed} />
    </UserFeedModal>
  );
}
