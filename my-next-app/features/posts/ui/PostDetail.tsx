import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import getPostDetailAction from "@/app/actions/posts.action";

export default async function PostDetail({
  params,
}: {
  params: Promise<{ userId: string; postId: string }>;
}) {
  const { userId, postId } = await params;
  const data = await getPostDetailAction({ userId, postId });

  if (data?.code === "USER_NOT_FOUND" || data?.code === "POST_NOT_FOUND") {
    notFound();
  }

  if (data?.isError) {
    return (
      <div className="px-5 py-10 text-center text-sm text-red-500">
        {data.message}
      </div>
    );
  }

  const { post, profile, previewComment, navigation } = data;

  return (
    <div className="pb-10">
      {/* 헤더 */}
      <div className="px-5 pt-6 pb-4">
        <Link
          href={`/users/${userId}`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-[#6B7280]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          {profile.name}
        </Link>

        <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
          {post.likeCount} likes · {post.commentCount} comments
        </p>
      </div>

      {/* 미디어 그리드 */}
      {post.media && post.media.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2.5 px-5">
          {post.media.map(
            (media: { url: string; type: string; order: number }) => (
              <li key={`${post._id}-${media.order}`}>
                <div className="relative aspect-square w-full overflow-hidden rounded-[18px] bg-[#ECE7E1]">
                  <Image
                    src={media.url}
                    fill
                    alt=""
                    className="object-cover"
                    unoptimized
                    sizes="(max-width: 768px) 30vw, 180px"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-[18px] ring-1 ring-black/4" />
                </div>
              </li>
            ),
          )}
        </ul>
      ) : (
        <div className="mx-5 rounded-3xl bg-[#F7F5F2] px-4 py-10 text-center">
          <p className="text-sm text-[#9CA3AF]">미디어가 없습니다.</p>
        </div>
      )}

      {/* 본문 */}
      {post.content ? (
        <div className="px-5 pt-5">
          <p className="text-[15px] leading-relaxed text-[#111827]">
            {post.content}
          </p>
        </div>
      ) : null}

      {/* 미리보기 댓글 */}
      {previewComment ? (
        <div className="mx-5 mt-5 rounded-2xl bg-[#F7F5F2] px-4 py-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#9CA3AF]">
            Comment
          </p>
          <p className="mt-1 text-[13px] font-semibold text-[#374151]">
            {previewComment.author?.id}
          </p>
          <p className="mt-0.5 text-[13px] text-[#6B7280]">
            {previewComment.content}
          </p>
        </div>
      ) : null}

      {/* 이전 / 다음 네비게이션 */}
      {navigation.prevPostId || navigation.nextPostId ? (
        <div className="mx-5 mt-5 flex gap-3">
          {navigation.prevPostId ? (
            <Link
              href={`/users/${userId}/posts/${navigation.prevPostId}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#F7F5F2] py-3 text-[13px] font-semibold text-[#374151]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
              이전 글
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {navigation.nextPostId ? (
            <Link
              href={`/users/${userId}/posts/${navigation.nextPostId}`}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#F7F5F2] py-3 text-[13px] font-semibold text-[#374151]"
            >
              다음 글
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      ) : null}
    </div>
  );
}
