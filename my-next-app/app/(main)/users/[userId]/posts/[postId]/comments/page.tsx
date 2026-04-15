// app/(main)/users/[userId]/posts/[postId]/comments
import { Suspense } from "react";
import CommentsPanel from "@/widgets/comments-sheet/ui/CommentsPanel";

export default function CommentsPage({
  params,
}: {
  params: Promise<{ userId: string; postId: string }>;
}) {
  return (
    <Suspense
      fallback={
        <p className="py-6 text-center text-sm text-gray-400">불러오는 중...</p>
      }
    >
      <CommentsPanelWrapper params={params} />
    </Suspense>
  );
}

async function CommentsPanelWrapper({
  params,
}: {
  params: Promise<{ userId: string; postId: string }>;
}) {
  const { postId } = await params;
  return <CommentsPanel postId={postId} />;
}
