"use client";
import FeedItemHeader from "./FeedItemHeader";
import FeedItemMeta from "./FeedItemMeta";
import FeedItemActions from "./FeedItemActions";
import { FeedItems } from "@/features/home/types/feed.type";
import PostMediaCarousel from "@/features/posts/ui/PostMediaCarousel";

export default function FeedItem({
  post,
}: {
  post: FeedItems;
  priorityPost: boolean;
}) {
  return (
    <li className="mt-20">
      <FeedItemHeader author={post.author} createdAt={post.createdAt} />

      {post.media?.length ? (
        <PostMediaCarousel
          postId={post.id}
          media={post.media}
          className="w-full rounded-xl mt-3"
        />
      ) : null}

      <div className="mt-2">{post.content}</div>
      <div className="flex items-baseline justify-between">
        <FeedItemMeta
          postId={post.id}
          authorHandle={post.author.userId}
          likeCount={post.likeCount}
          isLiked={post.isLiked}
          commentCount={post.commentCount}
        />
        <FeedItemActions postId={post.id} />
      </div>
    </li>
  );
}
