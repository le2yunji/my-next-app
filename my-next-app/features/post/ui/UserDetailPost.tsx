import { notFound } from "next/navigation";
import { getPostDetailAction } from "@/app/actions/posts.action";
import Image from "next/image";

export default async function UserDetailPost({
  params,
}: {
  params: Promise<{ userId: string; postId: string }>;
}) {
  const { userId, postId } = await params;
  const data = await getPostDetailAction({ userId, postId });

  if (data?.code === "USER_NOT_FOUND" || data?.code === "POST_NOT_FOUND") {
    notFound();
  }

  if (data?.isError)
    <div className="m-10 bg-white p-6">에러: {data.message}</div>;

  return (
    <div className="m-10 bg-white p-6">
      <h1 className="text-2xl font-bold">{userId}의 게시물</h1>

      <div className="mt-3 space-y-1">
        <p>유저 ID: {userId}</p>
        <p>이름: {data.profile.name}</p>
      </div>

      <div className="mt-5 space-y-1">
        <p>{data.post.content}</p>
        <p>좋아요 {data.post.likeCount}</p>
        <p>댓글 {data.post.commentCount}</p>
        <p>좋아요 여부: {String(data.post.likedByMe)}</p>
      </div>

      <div className="mt-5 grid gap-3">
        {data.post.media?.map(
          (media: { url: string; type: string; order: number }) => (
            <div
              key={`${data.post._id}-${media.order}`}
              className="relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={media.url}
                fill
                alt=""
                className="object-cover"
                unoptimized
              />
            </div>
          )
        )}
      </div>
      {data.previewComment && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">미리보기 댓글</h2>
          <p>{data.previewComment.author?.id}</p>
          <p>{data.previewComment.content}</p>
        </div>
      )}

      <div className="mt-6 space-y-1">
        <p>이전 글: {data.navigation.prevPostId ?? "없음"}</p>
        <p>다음 글: {data.navigation.nextPostId ?? "없음"}</p>
      </div>
    </div>
  );
}
