export type FeedItem = {
  _id: string;
  id: string;
  thumbnail: { type: "image"; url: string } | null;
  mediaCount: number;
  author: { id: string; name: string; profileImage: string | null };
  likeCount: number;
  commentCount: number;
  createdAt: string;
};
