// app/(main)/@modal/(.)users/[userId]/page.tsx
import UserFeedContainer from "@/containers/user/UserFeedContainer";
import UserFeedModal from "@/containers/user/UserFeedModal";

export default async function UserFeedPage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { userId } = await params;
  const { tab = "boards" } = await searchParams;

  return (
    <UserFeedModal>
      <UserFeedContainer userId={userId} tab={tab} />
    </UserFeedModal>
  );
}
