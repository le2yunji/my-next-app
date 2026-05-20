// views/settings/profile/ui/ProfileView
import { UpdateProfileForm } from "@/features/update-profile";

export default async function ProfileView() {
  return (
    <div className="mx-auto max-w-lg px-5 py-8">
      <h1 className="mb-6 text-xl font-bold">프로필 편집</h1>
      <UpdateProfileForm />
    </div>
  );
}
