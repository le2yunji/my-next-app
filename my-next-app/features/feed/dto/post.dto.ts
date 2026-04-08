export type PostMediaDto = {
  url: string;
  type: "image" | "video";
  order: number;
};

export type PostResponseDto = {
  id: string;
  authorId: string;
  content: string;
  media: PostMediaDto[];
  likeCount: number;
  commentCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};
