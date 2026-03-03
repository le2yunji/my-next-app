"use client";

import FeedItemHeader from "./FeedItemHeader";
import FeedItemMedia from "./FeedItemMedia";
import FeedItemMeta from "./FeedItemMeta";
import FeedItemActions from "./FeedItemActions";

export default function FeedItem({
  post,
  priorityPost,
}: {
  post: FeedItemModel;
  priorityPost: boolean;
}) {
  return (
    <li className="mt-20">
      <FeedItemHeader author={post.author} />

      {post.media?.length ? (
        <FeedItemMedia
          postId={post.id}
          media={post.media}
          priorityPost={priorityPost}
        />
      ) : null}

      <div>{post.content}</div>

      <FeedItemMeta
        likeCount={post.likeCount}
        commentCount={post.commentCount}
        createdAt={post.createdAt}
      />
      <FeedItemActions postId={post.id} />
    </li>
  );
}
