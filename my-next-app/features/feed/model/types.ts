type Media = { type: "image"; url: string };

export type FeedItemModel = {
  id: string;
  content: string;
  author: { id: string; nickname: string; profileImage: string | null };
  likeCount: number;
  commentCount: number;
  createdAt: string;

  // 상세/확장용(없을 수도 있음)
  media?: Media[];

  // 리스트용 대표 이미지(없을 수도 있음)
  thumbnail?: Media | null;

  // 있으면 같이 쓰기 좋음
  mediaCount?: number;
};
