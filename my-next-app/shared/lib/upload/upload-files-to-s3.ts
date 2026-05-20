import { getPresignedUrlsAction } from "@/app/actions/upload.action";
import type { UploadContext } from "./image-upload.constants";

type UploadFilesToS3Params = {
  context: UploadContext;
  files: File[];
};

export type S3UploadedFile = {
  key: string;
  publicUrl: string;
  mimeType: string;
  size: number;
};

export async function uploadFilesToS3({
  context,
  files,
}: UploadFilesToS3Params): Promise<
  | { isError: true; message: string }
  | { isError: false; data: S3UploadedFile[] }
> {
  const presignedResult = await getPresignedUrlsAction(
    context,
    files.map((file) => ({
      mimeType: file.type,
      size: file.size,
    })),
  );

  if (presignedResult.isError) {
    return {
      isError: true,
      message: presignedResult.message,
    };
  }

  const uploadResults = await Promise.all(
    files.map((file, index) =>
      fetch(presignedResult.data[index].presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      }),
    ),
  );

  const failedUpload = uploadResults.find((res) => !res.ok);

  if (failedUpload) {
    return {
      isError: true,
      message: "이미지 업로드에 실패했습니다.",
    };
  }

  return {
    isError: false,
    data: presignedResult.data.map((result, index) => ({
      key: result.key,
      publicUrl: result.publicUrl,
      mimeType: files[index].type,
      size: files[index].size,
    })),
  };
}
