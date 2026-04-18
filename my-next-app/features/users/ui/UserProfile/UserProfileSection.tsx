// components/user/UserProfileSection.tsx
import { getUserProfileAction } from "@/app/actions/users.action";
import UserProfile from "@/features/users/ui/UserProfile/UserProfile";

export default async function UserProfileSection({
  userId,
  isOwner,
}: {
  userId: string;
  isOwner: boolean;
}) {
  const user = await getUserProfileAction({ userId });

  return <UserProfile user={user} isOwner={isOwner} />;
}
