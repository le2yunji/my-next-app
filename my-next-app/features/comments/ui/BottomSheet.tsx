// widgets/comments-sheet/ui/BottomSheet.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { UserProfileItem } from "@/features/users/types/user.type";
import type { PostMediaDto } from "@/features/home/dto/post.dto";
import PostMediaCarousel from "@/features/posts/ui/PostMediaCarousel";
import Avatar from "@/components/common/Avatar";

type BottomSheetProps = {
  postId: string;
  children: React.ReactNode;
  postAuthor?: UserProfileItem | null;
  media?: PostMediaDto[];
  content?: string;
};

export default function BottomSheet({
  postId,
  children,
  postAuthor,
  media,
  content,
}: BottomSheetProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // 마운트 직후 애니메이션 시작
    const id = requestAnimationFrame(() => {
      setOpen(true);
    });

    // 배경 스크롤 잠금
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(id);
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleClose = () => {
    if (closing) return;
    setClosing(true);
    setOpen(false);

    setTimeout(() => {
      router.back();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-10000">
      {/* 공통 배경 딤 */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-250 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* ── 모바일: 하단 슬라이드업 시트 (md 미만) ── */}
      <div
        className={`absolute bottom-0 left-0 right-0 flex max-h-[85vh] flex-col rounded-t-3xl bg-white shadow-2xl transition-transform duration-250 ease-out md:hidden
          ${open ? "translate-y-0" : "translate-y-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 드래그 핸들 — flex-col에서 shrink되지 않도록 고정 */}
        <div className="flex shrink-0 justify-center py-3">
          <div className="h-1.5 w-12 rounded-full bg-gray-300" />
        </div>

        <div className="overflow-y-auto">{children}</div>
      </div>

      {/* ── 태블릿/데스크탑: 이미지 + 댓글 패널 모달 (md+) ── */}
      <div className="absolute inset-0 hidden items-center justify-center px-4 md:flex">
        <div
          className={`flex max-h-[90vh] w-full max-w-225 overflow-hidden rounded-2xl bg-white shadow-2xl transition-opacity duration-250
            ${open ? "opacity-100" : "opacity-0"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 왼쪽: 이미지 영역 */}
          {media?.length ? (
            <div className="flex w-[55%] shrink-0 items-center justify-center bg-black">
              <PostMediaCarousel
                postId={postId}
                media={media}
                className="w-full"
              />
            </div>
          ) : (
            // 이미지 없을 때 플레이스홀더
            <div className="flex w-[40%] shrink-0 items-center justify-center bg-linen">
              <div className="h-20 w-20 rounded-full bg-silver/30" />
            </div>
          )}

          {/* 오른쪽: 댓글 패널 */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* 헤더 */}
            <div className="flex items-center justify-between border-b border-linen px-5 py-4">
              <span className="text-[15px] font-bold">
                {postAuthor ? `${postAuthor.userId}` : "댓글"}
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="text-cool-gray transition-opacity hover:opacity-70"
                aria-label="닫기"
              >
                <X size={20} />
              </button>
            </div>
            {/* 게시글 본문 — 작성자 프로필 + userId + 내용 */}
            {content && (
              <div className="flex shrink-0 gap-3 border-b border-linen px-5 py-3">
                {/* 프로필 이미지 */}
                <div className="shrink-0">
                  {postAuthor?.profileImage ? (
                    <Avatar
                      src={postAuthor.profileImage}
                      alt={postAuthor.userId}
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-silver/40" />
                  )}
                </div>
                {/* userId + 본문 */}
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-near-black">
                    {postAuthor?.userId}
                  </span>{" "}
                  <span className="text-sm leading-relaxed text-near-black">
                    {content}
                  </span>
                </div>
              </div>
            )}
            {/* 댓글 목록 */}
            <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
