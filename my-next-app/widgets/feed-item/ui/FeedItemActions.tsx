"use client";

import { Bookmark, Send } from "lucide-react";
import { useState } from "react";

export default function FeedItemActions({ postId }: { postId: string }) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="mt-2 flex items-center gap-3">
      <button
        type="button"
        onClick={() => {
          // TODO: 공유 기능 연결
        }}
        className="text-cool-gray transition-opacity hover:opacity-70"
        aria-label="공유"
      >
        <Send size={20} strokeWidth={1.8} />
      </button>

      <button
        type="button"
        onClick={() => setSaved((v) => !v)}
        className={`ml-auto transition-colors ${saved ? "text-near-black" : "text-cool-gray"}`}
        aria-label={saved ? "저장 취소" : "저장"}
      >
        <Bookmark
          size={22}
          strokeWidth={1.8}
          className={saved ? "fill-near-black" : "fill-none"}
        />
      </button>
    </div>
  );
}
