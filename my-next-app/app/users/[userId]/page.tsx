// app/users/[userId]/page.tsx
import { getFeedByUserAction } from "@/app/actions/feed.action";
import UserFeedContainer from "@/containers/user/UserFeedContainer";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const [initialFeed] = await Promise.all([
    getFeedByUserAction({ userId, limit: 9 }),
  ]);
  console.log(userId);

  return <UserFeedContainer userId={userId} initialFeed={initialFeed} />;
}
