import UserDetailPost from "@/features/users/ui/UserPost/UserDetailPost";

// 유저 피드 -> 유저 게시물 상세
export default function UserDetailPostPage({
  params,
}: {
  params: Promise<{ userId: string; postId: string }>;
}) {
  return (
    <div>
      <UserDetailPost params={params} />
    </div>
  );
}
