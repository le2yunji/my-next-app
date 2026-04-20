// app/(main)/posts/[postId]/comments/page.tsx
// 댓글 전체 페이지 (바텀 시트 없이 풀 페이지로 진입 시)
import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getPostCommentsAction } from "@/app/actions/comments.action";
import { getMeServer } from "@/lib/auth/getMeServer";
import CommentList from "@/features/comments/ui/CommentList";

export default async function CommentsPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  return (
    <div className="flex h-screen flex-col md:h-auto md:min-h-screen">
      {/* 헤더 */}
      <header className="flex items-center gap-3 border-b border-linen px-4 py-4">
        <Link
          href={`/posts/${postId}`}
          className="text-cool-gray transition-opacity hover:opacity-70"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-[15px] font-bold text-near-black">댓글</h1>
      </header>

      {/* 댓글 목록 + 입력창 */}
      <Suspense fallback={<CommentsSkeleton />}>
        <CommentsContent postId={postId} />
      </Suspense>
    </div>
  );
}

async function CommentsContent({ postId }: { postId: string }) {
  const [data, me] = await Promise.all([
    getPostCommentsAction({ postId }),
    getMeServer(),
  ]);

  if (data?.isError) {
    return (
      <p className="py-12 text-center text-sm text-red-500">{data.message}</p>
    );
  }

  const threads = data?.items ?? [];

  return (
    <>
      {/* 댓글 수 */}
      <div className="px-4 py-3">
        <span className="text-sm font-semibold text-cool-gray">
          댓글 {threads.length > 0 ? `${threads.length}개` : ""}
        </span>
      </div>

      {/* 댓글 목록 + 입력창 (클라이언트 컴포넌트) */}
      <CommentList
        threads={threads}
        postId={postId}
        currentUserProfileImage={me?.profileImage ?? null}
      />
    </>
  );
}

function CommentsSkeleton() {
  return (
    <div className="flex-1 px-4 py-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="mb-5 flex gap-3">
          <div className="h-8 w-8 shrink-0 rounded-full bg-linen" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-20 rounded bg-linen" />
            <div className="h-3 w-full rounded bg-linen" />
            <div className="h-3 w-2/3 rounded bg-linen" />
          </div>
        </div>
      ))}
    </div>
  );
}
