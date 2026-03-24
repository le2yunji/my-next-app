import Image from "next/image";

type UserProfileModel = {
  id: string;
  nickname: string;
  name: string;
  profileImageUrl: string | null;
  bio: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  isMe: boolean;
  isFollowing: boolean;
};

export default function UserProfile({ user }: { user: UserProfileModel }) {
  return (
    <section className="flex items-center gap-4 p-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-200">
        {user.profileImageUrl ? (
          <Image
            src={user.profileImageUrl}
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
