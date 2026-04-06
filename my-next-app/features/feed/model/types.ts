export type PostMedia = {
  url: string;
  type: "image" | "video";
  order: number;
};

export type PostResponse = {
  id: string;
  authorId: string;
  content: string;
  media: PostMedia[];
  likeCount: number;
  commentCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FeedItemModel = {
  id: string;
  content: string;
  author: {
    id: string;
    userId: string;
    name: string;
    profileImage: string | null;
  };
  likeCount: number;
  commentCount: number;
  createdAt: string;

  media?: PostMedia[];
  thumbnail?: PostMedia | null;
  mediaCount?: number;
};
