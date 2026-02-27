// features/users/ui/UserFeedContainer.tsx
import UserFeedList from "@/features/users/ui/UserFeedList";

type FeedResponse = {
  items: any[];
  nextCursor: string | null;
  hasNext: boolean;
};

export default function UserFeedContainer({
  userId,
  initialFeed,
}: {
  userId: string;
  initialFeed: FeedResponse;
}) {
  console.log(userId);
  return (
    <div>
      <UserFeedList
        userId={userId}
        initialItems={initialFeed.items}
        initialCursor={initialFeed.nextCursor}
        initialHasNext={initialFeed.hasNext}
      />
    </div>
  );
}
