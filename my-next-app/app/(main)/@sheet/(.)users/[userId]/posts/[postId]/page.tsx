import { Suspense } from "react";
import BottomSheet from "@/features/comments/ui/BottomSheet";
import CommentsContent from "@/features/comments/ui/CommentsContent";
import { getUserProfileAction } from "@/app/actions/users.action";
import getPostDetailAction from "@/app/actions/posts.action";

// Page를 async로 만들면 params를 await하는 동안 페이지 전체가 블로킹됨
// 별도의 async BottomSheetWrapper로 분리하면, 이 컴포넌트만 suspend되고 Page 렌더는 즉시 시작할 수 있음

export default function CommentsBottomSheet({
  params,
}: {
  params: Promise<{ userId: string; postId: string }>;
}) {
  return <BottomSheetWrapper params={params} />;
}

async function BottomSheetWrapper({
  params,
}: {
  params: Promise<{ userId: string; postId: string }>;
}) {
  const { userId, postId } = await params;

  const [author, postData] = await Promise.all([
    getUserProfileAction({ userId }),
    getPostDetailAction({ userId, postId }),
  ]);

  return (
    <BottomSheet
      postId={postId}
      postAuthor={author}
      media={postData?.post?.media ?? []}
      content={postData?.post?.content}
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
