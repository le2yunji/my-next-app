import { getUserFeedAction } from "@/app/actions/users.action";
import UserFeedContainer from "@/containers/user/UserFeedContainer";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const initialFeed = await getUserFeedAction({ userId, limit: 9 });

  return <UserFeedContainer userId={userId} initialFeed={initialFeed} />;
}
