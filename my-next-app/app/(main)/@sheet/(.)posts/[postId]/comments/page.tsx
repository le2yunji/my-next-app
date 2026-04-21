// app/(main)/@sheet/(.)posts/[postId]/comments/page.tsx
import { Suspense } from "react";
import BottomSheet from "@/features/comments/ui/BottomSheet";
import CommentsPanel from "@/features/comments/ui/CommentsPanel";

export default function CommentsBottomSheet({
  params,
  searchParams,
}: {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ img?: string }>;
}) {
  return <BottomSheetWrapper params={params} searchParams={searchParams} />;
}

async function BottomSheetWrapper({
  params,
  searchParams,
}: {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ img?: string }>;
}) {
  const { postId } = await params;
  const { img } = await searchParams;

  return (
    <BottomSheet imgUrl={img}>
      <Suspense
        fallback={
          <p className="py-6 text-center text-sm text-gray-400">
            불러오는 중...
          </p>
        }
      >
        <CommentsPanel postId={postId} />
      </Suspense>
    </BottomSheet>
  );
}
