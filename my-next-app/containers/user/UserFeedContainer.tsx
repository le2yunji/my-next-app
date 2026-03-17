import { getUserProfileAction } from "@/app/actions/users.action";
import UserFeedList from "@/features/users/ui/UserFeedList";
import UserProfile from "@/features/users/ui/UserProfile";
import { Suspense } from "react";

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
  const userPromise = getUserProfileAction({ userId });

  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <UserProfile userPromise={userPromise} />
      </Suspense>

      <UserFeedList
        userId={userId}
        initialItems={initialFeed.items}
        initialCursor={initialFeed.nextCursor}
        initialHasNext={initialFeed.hasNext}
      />
    </>
  );
}
