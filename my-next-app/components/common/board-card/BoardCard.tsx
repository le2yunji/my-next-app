import Link from "next/link";
import BoardCardCollage from "./BoardCardCollage";
import BoardCardContent from "./BoardCardContent";
import { boardCardStyles } from "./board-card.style";
import { BoardCardProps } from "./board-card.type";

export default function BoardCard({
  board,
  size = "md",
  href,
  className = "",
  showArrow,
}: BoardCardProps) {
  const styles = boardCardStyles[size];

  const content = (
    <article className={`${styles.container} ${className}`.trim()}>
      <div className={styles.collageWrap}>
        <BoardCardCollage
          images={board.previewImages}
          size={size}
          title={board.title}
        />
      </div>

      <BoardCardContent board={board} size={size} showArrow={showArrow} />
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
