import { getFeedAction } from "@/entities/feed/api/feed.action";
import FeedList from "@/widgets/feed/ui/FeedList";

const PAGE_SIZE = 10;

export default async function HomePage() {
  const initial = await getFeedAction({ limit: PAGE_SIZE });
  return (
    <div className="flex">
      <FeedList
        initialItems={initial.items}
        initialCursor={initial.nextCursor}
        initialHasNext={initial.hasNext}
      />
    </div>
  );
}
