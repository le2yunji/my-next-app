import { getUserFeedAction } from "@/app/actions/users.action";
import UserFeedList from "@/features/users/ui/UserFeedList";

export default async function UserFeedSection({ userId }: { userId: string }) {
  const initialFeed = await getUserFeedAction({
    userId,
    limit: 9,
  });

  if (initialFeed?.isError) {
    return (
      <div className="p-4 text-sm text-red-500">
        유저 피드를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <UserFeedList
      userId={userId}
      initialItems={initialFeed.items}
      initialCursor={initialFeed.nextCursor}
      initialHasNext={initialFeed.hasNext}
    />
  );
}
