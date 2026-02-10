import { getFeedAction } from "@/app/actions/feed.action";
import FeedList from "@/features/feed/ui/FeedList";

const FeedContainer = async () => {
  const initial = await getFeedAction({ limit: 3 });
  return (
    <FeedList
      initialItems={initial.items}
      initialCursor={initial.nextCursor}
      initialHasNext={initial.hasNext}
    />
  );
};

export default FeedContainer;
