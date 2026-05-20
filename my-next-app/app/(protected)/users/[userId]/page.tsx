// app/(main)/users/[userId]/page.tsx
// 유저 개별 피드 페이지

import UserFeedWidget from "@/widgets/user-feed/ui/UserFeedWidget";

export default async function UserFeedPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { userId } = await params;
  const { tab = "boards" } = await searchParams;

  return (
    <>
      <div className="p-10">
        {userId}
        <h1>원본 상세 페이지</h1>
      </div>
      <UserFeedWidget userId={userId} tab={tab} />
    </>
  );
}
