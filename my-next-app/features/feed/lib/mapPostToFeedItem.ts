import { FeedItemModel, PostResponse } from "../model/types";

type AuthorMap = Record<
  string,
  {
    id: string;
    userId: string;
    name: string;
    profileImage: string | null;
  }
>;

export function mapPostToFeedItem(
  post: PostResponse,
  author?: {
    id: string;
    userId: string;
    name: string;
    profileImage: string | null;
  }
): FeedItemModel {
  const sortedMedia = [...(post.media ?? [])].sort((a, b) => a.order - b.order);
  const thumbnail =
    sortedMedia.find((m) => m.type === "image") ?? sortedMedia[0] ?? null;

  return {
    id: post.id,
    content: post.content,
    author: author ?? {
      id: post.authorId,
      userId: "알 수 없음",
      name: "알 수 없음",
      profileImage: null,
    },
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    createdAt: post.createdAt,
    media: sortedMedia,
    thumbnail,
    mediaCount: sortedMedia.length,
  };
}

export function mapPostListToFeedItems(
  posts: PostResponse[],
  authorMap?: AuthorMap
): FeedItemModel[] {
  return posts.map((post) =>
    mapPostToFeedItem(post, authorMap?.[post.authorId])
  );
}
