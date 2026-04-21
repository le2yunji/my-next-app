/** 백엔드 GET /api/users/:userId/boards 응답의 boards[] 각 항목 (Raw) */
export type RawApiBoard = {
  id: string;
  title: string;
  itemCount: number;
  previewImages?: { id: string; url: string }[];
  [key: string]: unknown;
};

/** 백엔드 GET /api/users/:userId/boards/:boardId 응답의 board 항목 (Raw) */
export type RawApiBoardDetail = {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  coverImage?: string | null;
  visibility: "public" | "private";
  itemCount: number;
  isOwner: boolean;
  [key: string]: unknown;
};

/** RawApiBoardDetail을 프론트에서 사용하는 형태로 매핑한 타입 */
export type MappedBoardDetail = {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  coverImage: string | null;
  visibility: "public" | "private";
  itemCount: number;
  isOwner: boolean;
};

/** 백엔드 GET /api/users/:userId/boards/:boardId 응답의 items[] 각 항목 (Raw) */
export type RawApiBoardPageItem = {
  id: string;
  boardId: string;
  ownerId: string;
  postId: string;
  thumbnailUrl: string | null;
  savedMediaOrder: number;
  note: string;
  [key: string]: unknown;
};

/** RawApiBoardPageItem을 프론트에서 사용하는 형태로 매핑한 타입 */
export type MappedBoardPageItem = {
  boardItemId: string;
  boardId: string;
  ownerId: string;
  postId: string;
  note: string;
  mediaOrder: number;
  thumbnailUrl: string | null;
};

/** 유저 프로필 보드 탭 목록 아이템 — action에서 board.id를 _id로 매핑한 프론트 전용 타입 */
export type UserBoardListItem = {
  _id: string;
  title: string;
  saveCount: number;
  previewImages: { id: string; url: string }[];
};
