export type BoardSize = "lg" | "md" | "sm";

export type BoardPreviewImage = {
  id: string;
  url: string;
};

/** 공통 보드 UI 컴포넌트(Board, Board)가 사용하는 보드 아이템 타입 */
export type BoardItem = {
  id: string;
  title: string;
  description?: string;
  saveCount: number;
  category?: string;
  previewImages: BoardPreviewImage[];
};

export type BoardProps = {
  board: BoardItem;
  size?: BoardSize;
  href?: string;
  className?: string;
  showArrow?: boolean;
};
