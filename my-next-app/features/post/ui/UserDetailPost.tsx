import { notFound } from "next/navigation";
import { getPostDetailAction } from "@/app/actions/posts.action";

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

  if (data?.isError) {
    return (
      <div style={{ background: "white", margin: 40, padding: 24 }}>
        에러: {data.message}
      </div>
    );
  }

  return (
    <div style={{ background: "white", margin: 40, padding: 24 }}>
      <h1>{data.profile.nickname}의 게시물</h1>

      <div style={{ marginTop: 12 }}>
        <p>유저 ID: {data.profile.id}</p>
        <p>닉네임: {data.profile.nickname}</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <p>{data.post.content}</p>
        <p>좋아요 {data.post.likeCount}</p>
        <p>댓글 {data.post.commentCount}</p>
        <p>좋아요 여부: {String(data.post.likedByMe)}</p>
      </div>

      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
        {data.post.media?.map((media: any) => (
          <img
            key={media.id}
            src={media.url}
            alt=""
            style={{
              width: 240,
              height: 240,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        ))}
      </div>

      {data.previewComment && (
        <div style={{ marginTop: 24 }}>
          <h2>미리보기 댓글</h2>
          <p>{data.previewComment.author?.nickname}</p>
          <p>{data.previewComment.content}</p>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <p>이전 글: {data.navigation.prevPostId ?? "없음"}</p>
        <p>다음 글: {data.navigation.nextPostId ?? "없음"}</p>
      </div>
    </div>
  );
}
