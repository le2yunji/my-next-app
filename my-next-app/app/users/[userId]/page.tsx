// app/users/[userId]/page.tsx
import { getUserFeedAction } from "@/app/actions/users.action";
import UserFeedContainer from "@/containers/user/UserFeedContainer";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const [initialFeed] = await Promise.all([
    // getUserProfile(userId),  // 유저 프로필
    getUserFeedAction({ userId, limit: 9 }),
  ]);
  console.log(userId);

  return <UserFeedContainer userId={userId} initialFeed={initialFeed} />;
}
