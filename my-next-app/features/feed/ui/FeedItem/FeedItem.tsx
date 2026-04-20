"use client";
import FeedItemHeader from "./FeedItemHeader";
import FeedItemMedia from "./FeedItemMedia";
import FeedItemMeta from "./FeedItemMeta";
import FeedItemActions from "./FeedItemActions";
import { FeedItem } from "@/features/feed/types/feed.type";

export default function FeedListItem({
  post,
  priorityPost,
}: {
  post: FeedItem;
  priorityPost: boolean;
}) {
  return (
    <li className="mt-20">
      <FeedItemHeader author={post.author} createdAt={post.createdAt} />

      {post.media?.length ? (
        <FeedItemMedia
          postId={post.id}
          media={post.media}
          priorityPost={priorityPost}
        />
      ) : null}

      <div className="mt-2">{post.content}</div>
      <div className="flex items-baseline justify-between">
        <FeedItemMeta
          postId={post.id}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          thumbnailUrl={post.media?.[0]?.url}
        />
        <FeedItemActions postId={post.id} />
      </div>
    </li>
  );
}
