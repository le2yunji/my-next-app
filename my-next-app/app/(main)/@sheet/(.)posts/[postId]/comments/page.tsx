// app/(main)/@sheet/(.)posts/[postId]/comments/page.tsx
import { Suspense } from "react";
import BottomSheet from "@/features/comments/ui/BottomSheet";
import CommentsContent from "@/features/comments/ui/CommentsContent";
import { getUserProfileAction } from "@/app/actions/users.action";
import getPostDetailAction from "@/app/actions/posts.action";

// Page를 async로 만들면 params/searchParams를 await하는 동안 페이지 전체가 블로킹됨
// 별도의 async BottomSheetWrapper로 분리하면, 이 컴포넌트만 suspend되고 Page 렌더는 즉시 시작할 수 있음 (Suspense로 감쌀 수 있는 구조)

export default function CommentsBottomSheet({
  params,
  searchParams,
}: {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ userId?: string }>;
}) {
  return <BottomSheetWrapper params={params} searchParams={searchParams} />;
}

async function BottomSheetWrapper({
  params,
  searchParams,
}: {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ userId?: string }>;
}) {
  const [{ postId }, { userId }] = await Promise.all([params, searchParams]);
  const [author, postData] = await Promise.all([
    userId ? getUserProfileAction({ userId }) : null,
    userId ? getPostDetailAction({ userId, postId }) : null, // 추가
  ]);

  return (
    <BottomSheet
      postId={postId}
      postAuthor={author}
      media={postData?.post?.media ?? []}
    >
      <Suspense
        fallback={
          <p className="py-6 text-center text-sm text-gray-400">
            불러오는 중...
          </p>
        }
      >
        <CommentsContent postId={postId} author={author} />
      </Suspense>
    </BottomSheet>
  );
}
