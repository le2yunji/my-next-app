import Image from "next/image";

type User = {
  profileImage: string | null;
  id: string;
  nickname: string;
};

export default function UserProfile({ user }: { user: User }) {
  return (
    <section className="flex items-center gap-4 p-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-200">
        {user.profileImage ? (
          <Image
            src={user.profileImage}
            alt={`${user.nickname} 프로필 이미지`}
            fill
            className="object-cover"
            unoptimized
          />
        ) : null}
      </div>

      <div>
        <p className="text-lg font-semibold">{user.nickname}</p>
        <p className="text-sm text-gray-500">{user.id}</p>
      </div>
    </section>
  );
}
