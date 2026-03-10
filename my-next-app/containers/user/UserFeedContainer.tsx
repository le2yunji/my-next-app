// features/users/ui/UserFeedContainer.tsx
import Spinner from "@/components/common/Spinner";
import UserFeedList from "@/features/users/ui/UserFeedList";
import { Suspense } from "react";

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
  return (
    <>
      {/* <UserProfile /> */}
      <Suspense fallback={<Spinner />}>
        <UserFeedList
          userId={userId}
          initialItems={initialFeed.items}
          initialCursor={initialFeed.nextCursor}
          initialHasNext={initialFeed.hasNext}
        />
      </Suspense>
    </>
  );
}
