/**
 * useImagePicker 역할:
  - 파일 선택
  - 파일 개수/type/size 검증
  - 원본 파일 상태 저장
  - 원본 파일 preview URL 생성
  - 삭제/초기화
 */

"use client";

import { useEffect, useRef, useState } from "react";
import type { UploadContext } from "./image-upload.constants";
import { validateImageFiles } from "./validate-image-files";

type UseImagePickerParams = {
  context: UploadContext;
};

function createObjectUrls(files: File[]) {
  const urls: string[] = [];

  try {
    for (const file of files) {
      urls.push(URL.createObjectURL(file));
    }

    return urls;
  } catch (error) {
    urls.forEach((url) => URL.revokeObjectURL(url));
    throw error;
  }
}

function revokeObjectUrls(urls: string[]) {
  urls.forEach((url) => URL.revokeObjectURL(url));
}

export function useImagePicker({ context }: UseImagePickerParams) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isAddingMoreRef = useRef(false); // 파일 선택이 새로 선택/교체인지, 기존 파일에 추가인지 구분하는 플래그
  const previewUrlsRef = useRef<string[]>([]); // 언마운트 시점에 최신 previewUrls를 정리하기 위한 ref

  // previewUrls가 바뀔 때마다 ref도 최신화
  useEffect(() => {
    previewUrlsRef.current = previewUrls;
  }, [previewUrls]);

  // 언마운트 시 blob URL들을 해제
  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // preview URL 전체 교체
  const replacePreviewUrls = (nextFiles: File[]) => {
    const nextPreviewUrls = createObjectUrls(nextFiles);

    revokeObjectUrls(previewUrls);
    setPreviewUrls(nextPreviewUrls);
  };

  // preview URL 추가 (기존 preview URL은 유지)
  const appendPreviewUrls = (nextFiles: File[]) => {
    const nextPreviewUrls = createObjectUrls(nextFiles);
    setPreviewUrls((prev) => [...prev, ...nextPreviewUrls]);
  };

  // 파일 선택 처리
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsProcessing(true);

    try {
      const selected = Array.from(e.target.files ?? []);
      e.target.value = "";

      if (selected.length === 0) return;

      const addingMore = isAddingMoreRef.current;
      isAddingMoreRef.current = false;

      // 최종 파일 후보
      const nextFiles = addingMore ? [...files, ...selected] : selected;

      const validationError = validateImageFiles({
        context,
        files: nextFiles,
      });

      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setFiles(nextFiles);

      // preview URL 생성
      if (addingMore) {
        appendPreviewUrls(selected);
        setPreviewIndex(files.length);
      } else {
        replacePreviewUrls(nextFiles);
        setPreviewIndex(0);
      }
    } catch {
      setError("이미지 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 새로 선택 버튼
  const openFileDialog = () => {
    isAddingMoreRef.current = false;
    fileInputRef.current?.click();
  };

  // 추가 선택 버튼
  const handleAddMore = () => {
    isAddingMoreRef.current = true;
    fileInputRef.current?.click();
  };

  // 파일 삭제
  const removeFile = (index: number) => {
    const targetUrl = previewUrls[index];

    if (targetUrl) {
      URL.revokeObjectURL(targetUrl);
    }

    const nextLength = files.length - 1;

    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));

    setPreviewIndex((prev) => {
      if (nextLength <= 0) return 0;
      if (prev >= nextLength) return nextLength - 1;
      return prev;
    });
  };

  // 전체 초기화
  const clear = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviewUrls([]);
    setPreviewIndex(0);
    setError(null);
    isAddingMoreRef.current = false;
  };

  return {
    files,
    previewUrls,
    previewIndex,
    setPreviewIndex,
    fileInputRef,
    isProcessing,
    error,
    setError,
    handleFileChange,
    openFileDialog,
    handleAddMore,
    removeFile,
    clear,
  };
}
