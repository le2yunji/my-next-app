"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import CreatePostModal from "@/features/post/ui/CreatePostModal";

export default function CreatePostButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 사이드바용 버튼 (lg: 텍스트 포함, md: 아이콘만) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-cool-gray px-4 py-3 text-near-black transition-colors hover:bg-linen md:px-2 lg:justify-start lg:px-4"
        aria-label="새 게시물"
      >
        <Plus size={20} strokeWidth={2.2} />
        <span className="hidden text-[14px] font-semibold lg:block">새 게시물</span>
      </button>

      {open && <CreatePostModal onClose={() => setOpen(false)} />}
    </>
  );
}
