// app/(main)/posts/[postId]/page.tsx
// 유저 피드 -> 유저 게시글 상세
import PostDetail from "@/features/posts/ui/PostDetail";

export default function UserDetailPostPage({
  params,
}: {
  params: Promise<{ userId: string; postId: string }>;
}) {
  return (
    <div>
      <PostDetail params={params} />
    </div>
  );
}
