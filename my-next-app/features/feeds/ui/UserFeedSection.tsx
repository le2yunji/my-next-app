import { getUserFeedAction } from "@/app/actions/users.action";
import { getUserBoardsAction } from "@/app/actions/boards.action";
import UserBoardList from "@/features/boards/ui/UserBoardList";
import PostList from "@/features/posts/ui/PostList";

export default async function UserFeedSection({
  userId,
  isOwner,
  tab,
}: {
  userId: string;
  isOwner: boolean;
  tab: string;
}) {
  if (tab === "posts") {
    const initialFeed = await getUserFeedAction({ userId, limit: 9 });

    return (
      <PostList
        userId={userId}
        initialItems={initialFeed.items}
        initialCursor={initialFeed.nextCursor}
        initialHasNext={initialFeed.hasNext}
      />
    );
  }

  if (tab === "boards") {
    const result = await getUserBoardsAction({ userId, limit: 6 });
    const items = "isError" in result ? [] : result.items;
    const nextCursor = "isError" in result ? null : result.nextCursor;
    const hasNext = "isError" in result ? false : result.hasNext;

    return (
      <UserBoardList
        userId={userId}
        initialItems={items}
        initialCursor={nextCursor}
        initialHasNext={hasNext}
      />
    );
  }

  // tab === "saved"
  return (
    <div className="px-5 py-10 text-center text-sm text-[#9CA3AF]">
      저장된 항목이 없습니다.
    </div>
  );
}
