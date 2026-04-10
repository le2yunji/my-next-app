import { BoardItem } from "@/types/board";
import { BoardCardSize } from "./board-card.type";
import { boardCardStyles } from "./board-card.style";

export default function BoardCardContent({
  board,
  size,
  showArrow,
}: {
  board: BoardItem;
  size: BoardCardSize;
  showArrow?: boolean;
}) {
  const styles = boardCardStyles[size];
  const shouldShowArrow = showArrow ?? styles.showArrow;

  return (
    <div>
      <h3 className={styles.title}>{board.title}</h3>

      {styles.showDescription && board.description ? (
        <p className={styles.description}>{board.description}</p>
      ) : null}

      <div className={styles.metaRow}>
        <p className={styles.saveText}>{board.saveCount} saves</p>

        <div className="flex items-center gap-2">
          {styles.showBadge && board.category ? (
            <span className="rounded-full bg-[#FFF3E8] px-3 py-1.5 text-[13px] font-medium text-[#F97316]">
              {board.category}
            </span>
          ) : null}

          {shouldShowArrow ? (
            <span
              aria-hidden="true"
              className="text-[24px] leading-none text-[#D1D5DB]"
            >
              ›
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
