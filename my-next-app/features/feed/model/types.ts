type FeedItemModel = {
  id: string;
  content: string;
  author: { id: string; nickname: string; profileImage: string | null };
  likeCount: number;
  commentCount: number;
  createdAt: string;
  media?: { type: "image"; url: string }[];
};
