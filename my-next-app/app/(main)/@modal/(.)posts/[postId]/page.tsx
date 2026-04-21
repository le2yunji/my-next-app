// 유저 피드 -> 유저 게시물 상세
// app/(main)/@modal/users/(.)[userId]/posts/[postId]/page.tsx
import PostDetail from "@/features/posts/ui/PostDetail";
import UserDetailPostModal from "@/features/posts/ui/UserDetailPostModal";

export default function UserDetailPostPage({
  params,
}: {
  params: Promise<{ userId: string; postId: string }>;
}) {
  return (
    <UserDetailPostModal>
      <PostDetail params={params} />
    </UserDetailPostModal>
  );
}
