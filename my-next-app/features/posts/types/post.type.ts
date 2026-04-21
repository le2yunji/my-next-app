// posts.mapper.js toUserPostItemResponse 응답 구조와 동기화
export type PostItem = {
  _id: string;
  thumbnail: { type: string; url: string } | null;
  mediaCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
};
