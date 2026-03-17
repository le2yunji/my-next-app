import { getUserFeedAction } from "@/app/actions/users.action";
import UserFeedList from "@/features/users/ui/UserFeedList";

export default async function UserFeedSection({ userId }: { userId: string }) {
  const initialFeed = await getUserFeedAction({ userId, limit: 9 });

  return (
    <UserFeedList
      userId={userId}
      initialItems={initialFeed.items}
      initialCursor={initialFeed.nextCursor}
      initialHasNext={initialFeed.hasNext}
    />
  );
}
