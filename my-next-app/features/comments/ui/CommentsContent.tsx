import { getPostCommentsAction } from "@/app/actions/comments.action";
import { getMeServer } from "@/lib/auth/getMeServer";
import CommentList from "@/features/comments/ui/CommentList";
import type { UserProfileItem } from "@/features/users/types/user.type";

export default async function CommentsContent({
  postId,
  author,
}: {
  postId: string;
  /** 게시물 작성자 프로필. username·profileImage·isFollowing 등 활용 */
  author?: UserProfileItem | null;
}) {
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
  // 최상위 댓글 수 + 각 스레드의 대댓글 수 합산
  const totalCount = (threads as Array<{ replies: unknown[] }>).reduce(
    (acc, { replies }) => acc + 1 + replies.length,
    0,
  );

  return (
    <>
      {/* 댓글 수 */}
      <div className="px-4 pt-2">
        <span className="text-sm font-semibold text-cool-gray">
          댓글 {totalCount > 0 ? `${totalCount}개` : ""}
        </span>
      </div>

      {/* 댓글 목록 + 입력창 (클라이언트 컴포넌트) */}
      <CommentList
        threads={threads}
        postId={postId}
        currentUserId={me?._id ? String(me._id) : null}
        currentUserProfileImage={me?.profileImage ?? null}
        isLoggedIn={!!me}
      />
    </>
  );
}
