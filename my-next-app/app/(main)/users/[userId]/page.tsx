// app/(main)/users/[userId]/page.tsx
// 유저 개별 피드 페이지

import UserFeedContainer from "@/containers/user/UserFeedContainer";

export default async function UserFeedPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <>
      <div style={{ padding: 40 }}>
        {userId}
        <h1>원본 상세 페이지</h1>
      </div>
      <UserFeedContainer userId={userId} />
    </>
  );
}
