import Link from "next/link";
import BoardCollage from "./BoardCollage";
import BoardContent from "./BoardContent";
import { boardStyles } from "./board.style";
import { BoardProps } from "./board.type";

export default function Board({
  board,
  size = "md",
  href,
  className = "",
  showArrow,
}: BoardProps) {
  const styles = boardStyles[size];

  const content = (
    <article className={`${styles.container} ${className}`.trim()}>
      <div className={styles.collageWrap}>
        <BoardCollage
          images={board.previewImages}
          size={size}
          title={board.title}
        />
      </div>

      <BoardContent board={board} size={size} showArrow={showArrow} />
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
