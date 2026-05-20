"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ImageIcon,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useAuthStore } from "@/entities/session/client";
import Avatar from "@/shared/ui/Avatar";
import { useImagePicker } from "@/shared/lib/upload/useImagePicker";
import { IMAGE_ACCEPT } from "@/shared/lib/upload/image-upload.constants";
import { createPostWithImages } from "../api/create-post-with-images";

type Step = "upload" | "caption" | "done";

const MAX_FILES = 10;

export default function CreatePostModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("upload");
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const user = useAuthStore((s) => s.user);

  const {
    files,
    previewUrls,
    previewIndex,
    setPreviewIndex,
    fileInputRef,
    isProcessing,
    error: imageError,
    handleFileChange,
    openFileDialog,
    handleAddMore,
    removeFile,
    clear,
  } = useImagePicker({
    context: "post",
  });
  const error = imageError ?? submitError;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  const handleNext = () => {
    if (files.length === 0) return;

    setSubmitError(null);
    setPreviewIndex(0);
    setStep("caption");
  };

  const handleSubmit = async () => {
    if (!user || files.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createPostWithImages({
        userId: user._id,
        caption,
        files,
      });

      if (result.isError) {
        setSubmitError(result.message);
        return;
      }
      clear();
      setStep("done");
    } catch {
      setSubmitError("게시물 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/65 p-4"
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
          {step === "upload" && files.length > 0 ? (
            <button
              type="button"
              onClick={handleNext}
              className="text-[14px] font-bold text-near-black transition-opacity hover:opacity-70"
            >
              다음
            </button>
          ) : step === "caption" ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="text-[14px] font-bold text-near-black transition-opacity hover:opacity-70 disabled:opacity-40"
            >
              {isSubmitting ? "공유 중..." : "공유"}
            </button>
          ) : (
            <div className="w-5" />
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 px-5 py-2 text-[13px] text-red-500">
            {error}
          </div>
        )}

        {/* Step 1 — 빈 상태 */}
        {step === "upload" && files.length === 0 && (
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
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={IMAGE_ACCEPT}
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="rounded-xl bg-near-black px-8 py-3 text-[14px] font-semibold text-warm-white transition-opacity hover:opacity-85 disabled:opacity-40"
            >
              {isProcessing ? "처리 중..." : "갤러리에서 선택"}
            </button>
          </div>
        )}

        {/* Step 1 — 사진 선택됨: 썸네일 그리드 */}
        {step === "upload" && files.length > 0 && (
          <div className="p-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={IMAGE_ACCEPT}
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="grid grid-cols-3 gap-1">
              {previewUrls.map((url, i) => (
                <div
                  key={url}
                  className="relative aspect-square overflow-hidden rounded-sm bg-linen"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`선택된 사진 ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white transition-opacity hover:opacity-80"
                    aria-label="사진 제거"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {/* 추가 버튼 — 최대 개수 미만일 때만 표시 */}
              {files.length < MAX_FILES && (
                <button
                  type="button"
                  onClick={handleAddMore}
                  disabled={isProcessing}
                  className="flex aspect-square items-center justify-center rounded-sm bg-linen transition-opacity hover:opacity-70 disabled:opacity-40"
                  aria-label="사진 추가"
                >
                  {isProcessing ? (
                    <span className="text-[11px] text-silver">처리 중</span>
                  ) : (
                    <Plus
                      size={24}
                      strokeWidth={1.8}
                      className="text-cool-gray"
                    />
                  )}
                </button>
              )}
            </div>
            <p className="mt-2 text-right text-[12px] text-silver">
              {files.length}/{MAX_FILES}
            </p>
          </div>
        )}

        {/* Step 2 — 문구 입력 */}
        {step === "caption" && (
          <div>
            <div className="flex">
              {/* 미리보기 이미지 */}
              <div className="relative h-60 w-60 shrink-0 bg-linen">
                {previewUrls[previewIndex] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrls[previewIndex]}
                    alt="미리보기"
                    className="h-full w-full object-cover"
                  />
                )}
                {previewUrls.length > 1 && (
                  <>
                    {previewIndex > 0 && (
                      <button
                        type="button"
                        onClick={() => setPreviewIndex((i) => i - 1)}
                        className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white"
                      >
                        <ChevronLeft size={16} />
                      </button>
                    )}

                    {previewIndex < previewUrls.length - 1 && (
                      <button
                        type="button"
                        onClick={() => setPreviewIndex((i) => i + 1)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-1 text-white"
                      >
                        <ChevronRight size={16} />
                      </button>
                    )}
                    <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[11px] text-white">
                      {previewIndex + 1}/{previewUrls.length}
                    </span>
                  </>
                )}
              </div>

              {/* 문구 입력 영역 */}
              <div className="flex flex-1 flex-col px-4 py-4">
                <div className="mb-3 flex items-center gap-2.5">
                  <Avatar src={null} alt={user?.userId ?? ""} size="xs" />
                  <span className="text-[14px] font-semibold">
                    {user?.userId ?? ""}
                  </span>
                </div>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="문구 입력..."
                  maxLength={2000}
                  className="h-28 w-full resize-none text-[14px] text-slate outline-none placeholder:text-silver"
                />
                <span className="mt-auto text-right text-[12px] text-gray">
                  {caption.length}/2,000
                </span>
              </div>
            </div>

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
    </div>,
    document.body,
  );
}
