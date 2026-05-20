// 게시글 생성 함수
import { createPostAction } from "@/app/actions/posts.action";
import { compressImage } from "@/shared/lib/upload/compressImage";
import { uploadFilesToS3 } from "@/shared/lib/upload/upload-files-to-s3";
import { validateImageFiles } from "@/shared/lib/upload/validate-image-files";

type CreatePostWithImagesParams = {
  userId: string;
  caption: string;
  files: File[];
};

export async function createPostWithImages({
  userId,
  caption,
  files,
}: CreatePostWithImagesParams): Promise<
  { isError: true; message: string } | { isError: false }
> {
  // 압축
  const compressedFiles = await Promise.all(
    files.map((file) => compressImage(file, { variant: "post" })),
  );

  // 검증
  const validationError = validateImageFiles({
    context: "post",
    files: compressedFiles,
  });

  if (validationError) {
    return {
      isError: true,
      message: validationError,
    };
  }

  const uploadResult = await uploadFilesToS3({
    context: "post",
    files: compressedFiles,
  });

  if (uploadResult.isError) {
    return uploadResult;
  }

  const postResult = await createPostAction({
    userId,
    content: caption,
    media: uploadResult.data.map((image, index) => ({
      key: image.key,
      url: image.publicUrl,
      type: "image" as const,
      order: index + 1,
    })),
  });

  if (postResult.isError) {
    return {
      isError: true,
      message: postResult.message ?? "게시물 등록에 실패했습니다.",
    };
  }

  return { isError: false };
}
