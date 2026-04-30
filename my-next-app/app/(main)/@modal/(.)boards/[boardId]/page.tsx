// 유저 보드 -> 유저 보드 상세
// app/(main)/@modal/(.)users/[userId]/boards/[boardId]/page.tsx
import UserDetailBoard from "@/features/boards/ui/UserDetailBoard";
import UserDetailBoardModal from "@/features/boards/ui/UserDetailBoardModal";

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
