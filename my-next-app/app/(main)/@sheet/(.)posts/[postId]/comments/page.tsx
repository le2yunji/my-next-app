// app/(main)/@sheet/(.)posts/[postId]/comments/page.tsx
import { Suspense } from "react";
import BottomSheet from "@/widgets/comments-sheet/ui/BottomSheet";
import CommentsPanel from "@/widgets/comments-sheet/ui/CommentsPanel";

export default function CommentsBottomSheet({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  return (
    <BottomSheet>
      <Suspense
        fallback={
          <p className="py-6 text-center text-sm text-gray-400">
            불러오는 중...
          </p>
        }
      >
        <CommentsPanelWrapper params={params} />
      </Suspense>
    </BottomSheet>
  );
}

async function CommentsPanelWrapper({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  return <CommentsPanel postId={postId} />;
}
