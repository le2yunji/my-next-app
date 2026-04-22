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

  return (
    <>
      {/* 댓글 수 */}
      <div className="px-4 pt-2">
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
