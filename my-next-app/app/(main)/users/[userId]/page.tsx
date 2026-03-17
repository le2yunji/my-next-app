// app/(main)/users/[userId]/page.tsx
// 유저 개별 피드 페이지

import { getUserFeedAction } from "@/app/actions/users.action";
import UserFeedContainer from "@/containers/user/UserFeedContainer";

export default async function UserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  console.log("원본 상세 페이지 렌더링");
  const initialFeed = await getUserFeedAction({ userId, limit: 9 });

  return (
    <>
      <div style={{ padding: 40 }}>
        <h1>원본 상세 페이지</h1>
        <p>{userId}</p>
      </div>
      <UserFeedContainer userId={userId} initialFeed={initialFeed} />
    </>
  );
}
