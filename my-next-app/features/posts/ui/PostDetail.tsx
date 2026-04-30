// app/(main)/posts/[postId]/comments/page.tsx
// 댓글 전체 페이지 (바텀 시트 없이 풀 페이지로 진입 시)
import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import CommentsSkeleton from "@/features/comments/ui/CommentsSkeleton";
import CommentsContent from "@/features/comments/ui/CommentsContent";
import { getUserProfileAction } from "@/app/actions/users.action";
import FollowButton from "@/features/users/ui/UserProfile/FollowButton";
import Avatar from "@/components/common/Avatar";
import Image from "next/image";
import getPostDetailAction from "@/app/actions/posts.action";

export default async function PostDetail({
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
    <div className="flex h-screen flex-col md:h-auto md:min-h-screenm ml-10">
      {/* 헤더 */}
      <header className="flex items-center gap-3 border-b border-linen px-4 py-4">
        <Link
          href={`/`}
          className="text-cool-gray transition-opacity hover:opacity-70"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={22} />
        </Link>
        <div className="flex items-center gap-2">
          <Avatar
            src={author ? author.profileImage : null}
            alt={author ? `${author.userId}의 프로필 사진` : "알수없음"}
            size="xs"
            className="mt-0.5 shrink-0"
          />
          <h1 className="text-[15px] font-bold text-near-black">
            {author?.userId ? `${author.userId}` : "댓글"}
          </h1>
        </div>

        {/* <FollowButton
          targetUserId={author._id}
          initialIsFollowing={false}
          size={"sm"}
        /> */}
      </header>

      {/* 사진 1행 나열 */}
      {postData?.post?.media?.length ? (
        <div
          className="flex gap-2 overflow-x-auto px-4 py-4 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {postData.post.media.map((m: { url: string; order: number }) => (
            <div
              key={m.order}
              className="relative aspect-square h-90 w-90 shrink-0 overflow-hidden rounded-md bg-[#ECE7E1]"
            >
              <Image
                src={m.url}
                alt=""
                fill
                className="object-cover"
                loading="eager"
                unoptimized
              />
            </div>
          ))}
        </div>
      ) : null}

      {/* 댓글 목록 + 입력창 */}
      <Suspense fallback={<CommentsSkeleton />}>
        <CommentsContent postId={postId} author={author} />
      </Suspense>
    </div>
  );
}
