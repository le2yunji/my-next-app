import type { PostMediaDto } from "../dto/post.dto";

export type FeedAuthor = {
  id: string;
  userId: string;
  name: string;
  profileImage: string | null;
};

// 일반 피드 (/api/feed) 응답 구조
export type FeedItems = {
  id: string;
  content: string;
  author: FeedAuthor;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  media: PostMediaDto[];
  mediaCount: number;
};
