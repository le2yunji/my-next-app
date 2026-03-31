"use client";

import Link from "next/link";
import { FeedItemModel } from "../../model/types";

export default function FeedItemHeader({
  author,
}: {
  author: FeedItemModel["author"];
}) {
  return (
    <Link href={`/users/${author.id}`} scroll={false}>
      {author.nickname}
    </Link>
  );
}
