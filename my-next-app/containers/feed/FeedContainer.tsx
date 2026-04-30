import { getFeedAction } from "@/app/actions/feed.action";
import FeedList from "@/features/home/ui/FeedList";
import { getMeServer } from "@/lib/auth/getMeServer";

const PAGE_SIZE = 10;

const FeedContainer = async () => {
  const [initial, me] = await Promise.all([
    getFeedAction({ limit: PAGE_SIZE }),
    getMeServer(),
  ]);
  return (
    <FeedList
      initialItems={initial.items}
      initialCursor={initial.nextCursor}
      initialHasNext={initial.hasNext}
      isLoggedIn={!!me}
    />
  );
};

export default FeedContainer;
