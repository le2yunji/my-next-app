// import { uploadFilesToS3 } from "@/shared/lib/upload/upload-files-to-s3";
// import { updateProfileImageAction } from "@/app/actions/profile.action";

// type UploadProfileImageParams = {
//   file: File;
// };

// export async function uploadProfileImage({
//   file,
// }: UploadProfileImageParams): Promise<
//   | { isError: true; message: string }
//   | { isError: false; data: { key: string; publicUrl: string } }
// > {
//   const uploadResult = await uploadFilesToS3({
//     context: "profile",
//     files: [file],
//   });

//   if (uploadResult.isError) {
//     return uploadResult;
//   }

//   const uploaded = uploadResult.data[0];

//   const profileResult = await updateProfileImageAction({
//     imageKey: uploaded.key,
//     imageUrl: uploaded.publicUrl,
//   });

//   if (profileResult.isError) {
//     return {
//       isError: true,
//       message: profileResult.message ?? "프로필 사진 변경에 실패했습니다.",
//     };
//   }

//   return {
//     isError: false,
//     data: {
//       key: uploaded.key,
//       publicUrl: uploaded.publicUrl,
//     },
//   };
// }
