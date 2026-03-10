import { getUserProfileAction } from "@/app/actions/users.action";
import UserFeedList from "@/features/users/ui/UserFeedList";
import UserProfile from "@/features/users/ui/UserProfile";

type FeedResponse = {
  items: any[];
  nextCursor: string | null;
  hasNext: boolean;
};

export default async function UserFeedContainer({
  userId,
  initialFeed,
}: {
  userId: string;
  initialFeed: FeedResponse;
}) {
  const data = await getUserProfileAction({ userId });
  return (
    <>
      <UserProfile user={data.user} />
      <UserFeedList
        userId={userId}
        initialItems={initialFeed.items}
        initialCursor={initialFeed.nextCursor}
        initialHasNext={initialFeed.hasNext}
      />
    </>
  );
}
