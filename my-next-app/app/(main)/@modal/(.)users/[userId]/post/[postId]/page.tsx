// 유저 피드 -> 유저 게시물 상세
// app/(main)/@modal/(.)[userId]/[postId]/page.tsx
import UserDetailPost from "@/features/post/ui/UserDetailPost";
import UserDetailPostModal from "@/containers/user/UserFeedModal";

export default function UserDetailPostPage({
  params,
}: {
  params: Promise<{ userId: string; postId: string }>;
}) {
  return (
    <UserDetailPostModal>
      <UserDetailPost params={params} />
    </UserDetailPostModal>
  );
}
