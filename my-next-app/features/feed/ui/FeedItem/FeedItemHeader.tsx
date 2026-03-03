"use client";

import Link from "next/link";

export default function FeedItemHeader({
  author,
}: {
  author: FeedItemModel["author"];
}) {
  return <Link href={`/users/${author.id}`}>{author.nickname}</Link>;
}
