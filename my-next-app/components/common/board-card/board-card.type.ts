import { BoardItem } from "@/types/board";

export type BoardCardSize = "lg" | "md" | "sm";

export type BoardCardProps = {
  board: BoardItem;
  size?: BoardCardSize;
  href?: string;
  className?: string;
  showArrow?: boolean;
};
