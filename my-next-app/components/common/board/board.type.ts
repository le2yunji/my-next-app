import { BoardItem } from "@/types/board";

export type BoardSize = "lg" | "md" | "sm";

export type BoardProps = {
  board: BoardItem;
  size?: BoardSize;
  href?: string;
  className?: string;
  showArrow?: boolean;
};
