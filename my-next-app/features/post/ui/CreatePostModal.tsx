"use client";

import { useEffect, useState } from "react";
import { X, ImageIcon, Check } from "lucide-react";

type Step = "upload" | "caption" | "done";

export default function CreatePostModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("upload");
  const [caption, setCaption] = useState("");

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    // 배경 딤 처리
    <div
      onClick={onClose}
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/65 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-linen px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="text-cool-gray transition-opacity hover:opacity-70"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
          <span className="text-[15px] font-bold">새 게시물</span>
          {step === "caption" ? (
            <button
              type="button"
              onClick={() => setStep("done")}
              className="text-[14px] font-bold text-near-black transition-opacity hover:opacity-70"
            >
              공유
            </button>
          ) : (
            <div className="w-5" />
          )}
        </div>

        {/* Step 1 — 이미지 선택 */}
        {step === "upload" && (
          <div className="flex flex-col items-center gap-4 px-10 py-10">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-linen">
              <ImageIcon
                size={36}
                strokeWidth={1.4}
                className="text-cool-gray"
              />
            </div>
            <div className="text-center">
              <p className="mb-2 text-lg font-semibold">
                사진 또는 동영상 선택
              </p>
              <p className="text-[13px] text-silver">
                갤러리에서 사진이나 동영상을 선택하세요
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep("caption")}
              className="rounded-xl bg-near-black px-8 py-3 text-[14px] font-semibold text-warm-white transition-opacity hover:opacity-85"
            >
              갤러리에서 선택
            </button>
          </div>
        )}

        {/* Step 2 — 문구 입력 */}
        {step === "caption" && (
          <div>
            <div className="flex">
              {/* 미리보기 이미지 */}
              <div className="h-60 w-60 shrink-0 bg-linen">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://picsum.photos/seed/new1/400/400"
                  alt="미리보기"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* 문구 입력 영역 */}
              <div className="flex flex-1 flex-col px-4 py-4">
                <div className="mb-3 flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://i.pravatar.cc/150?img=5"
                    alt="내 아바타"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-[14px] font-semibold">me_user</span>
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="문구 입력..."
                  maxLength={2200}
                  className="h-28 w-full resize-none text-[14px] text-slate outline-none placeholder:text-silver"
                />
                <span className="mt-auto text-right text-[12px] text-gray">
                  {caption.length}/2,200
                </span>
              </div>
            </div>

            {/* 보드 저장 옵션 */}
            <div className="flex items-center gap-2 border-t border-linen px-5 py-3.5">
              <span className="text-[13px] text-cool-gray">보드에 저장</span>
              <span className="ml-auto text-[12px] text-gray">선택</span>
            </div>
          </div>
        )}

        {/* Step 3 — 완료 */}
        {step === "done" && (
          <div className="flex flex-col items-center gap-3.5 px-10 py-12">
            <div className="flex h-18 w-18 items-center justify-center rounded-full bg-near-black">
              <Check size={32} strokeWidth={2.5} className="text-warm-white" />
            </div>
            <p className="text-lg font-bold">게시물이 공유되었습니다</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 text-[14px] text-cool-gray transition-colors hover:text-near-black"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
