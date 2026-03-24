// components/user/UserProfileSection.tsx
import { getUserProfileAction } from "@/app/actions/users.action";
import UserProfile from "@/features/users/ui/UserProfile";

export default async function UserProfileSection({
  userId,
}: {
  userId: string;
}) {
  const user = await getUserProfileAction({ userId });

  return <UserProfile user={user} />;
}
