import type { PostMediaDto } from "../dto/post.dto";

export type FeedAuthor = {
  id: string;
  userId: string;
  name: string;
  profileImage: string | null;
};

export type FeedItem = {
  id: string;
  content: string;
  author: FeedAuthor;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  media: PostMediaDto[];
  thumbnail: PostMediaDto | null;
  mediaCount: number;
};
