// widgets/comments-sheet/ui/CommentsPanel.tsx
import { getPostCommentsAction } from "@/app/actions/comments.action";

type Author = {
  id: string;
  userId: string;
  name: string;
  profileImage: string | null;
};

type CommentItem = {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  depth: number;
  replyCount: number;
  parentCommentId: string | null;
  isDeleted: boolean;
};

type CommentThread = {
  comment: CommentItem;
  replies: CommentItem[];
};

export default async function CommentsPanel({ postId }: { postId: string }) {
  const data = await getPostCommentsAction({ postId });

  if (data?.isError) {
    return (
      <p className="py-6 text-center text-sm text-red-500">{data.message}</p>
    );
  }

  const threads: CommentThread[] = data?.items ?? [];

  return (
    <section className="pb-6">
      <h2 className="mb-4 text-base font-semibold">
        댓글 {threads.length > 0 ? `${threads.length}개` : ""}
      </h2>

      {threads.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          첫 댓글을 남겨보세요
        </p>
      ) : (
        <ul className="space-y-4">
          {threads.map(({ comment, replies }) => (
            <li key={comment.id}>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">
                  @{comment.author.userId}
                </span>
                <span className="mt-0.5 text-sm text-gray-700">
                  {comment.content}
                </span>
              </div>

              {replies.length > 0 && (
                <ul className="ml-4 mt-2 space-y-2 border-l border-gray-100 pl-3">
                  {replies.map((reply) => (
                    <li key={reply.id} className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800">
                        @{reply.author.userId}
                      </span>
                      <span className="mt-0.5 text-sm text-gray-700">
                        {reply.content}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
