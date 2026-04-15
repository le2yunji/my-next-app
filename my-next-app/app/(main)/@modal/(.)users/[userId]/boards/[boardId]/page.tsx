// 유저 보드 -> 유저 보드 상세
// app/(main)/@modal/(.)users/[userId]/boards/[boardId]/page.tsx
import UserDetailBoard from "@/features/users/ui/UserBoard/UserDetailBoard";
import UserDetailBoardModal from "@/containers/user/UserDetailBoardModal";

export default function UserDetailBoardPage({
  params,
}: {
  params: Promise<{ userId: string; boardId: string }>;
}) {
  return (
    <UserDetailBoardModal>
      <UserDetailBoard params={params} />
    </UserDetailBoardModal>
  );
}
