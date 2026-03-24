// app/(main)/@modal/(.)users/[userId]/page.tsx
import UserFeedContainer from "@/containers/user/UserFeedContainer";
import UserFeedModal from "@/containers/user/UserFeedModal";

export default async function UserFeedPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <UserFeedModal>
      <UserFeedContainer userId={userId} />
    </UserFeedModal>
  );
}
