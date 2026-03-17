// 유저 피드 -> 유저 게시물 상세
// app/(main)/@modal/(.)[userId]/[postId]/page.tsx

export default async function UserDetailPost({
  params,
}: {
  params: Promise<{ userId: string; postId: string }>;
}) {
  const { userId, postId } = await params;

  console.log("✅ 인터셉트 게시글 모달 렌더링");

  return (
    <div style={{ background: "white", margin: 40, padding: 24 }}>
      INTERCEPT POST MODAL: {userId} / {postId}
    </div>
  );
}
