import { getFeedAction } from "@/app/actions/feed.action";
import FeedList from "@/features/feed/ui/FeedList";

const PAGE_SIZE = 10;

const FeedContainer = async () => {
  const initial = await getFeedAction({ limit: PAGE_SIZE });
  return (
    <FeedList
      initialItems={initial.items}
      initialCursor={initial.nextCursor}
      initialHasNext={initial.hasNext}
    />
  );
};

export default FeedContainer;
