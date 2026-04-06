import Image from "next/image";

type UserProfileModel = {
  id: string;
  name: string;
  profileImage: string | null;
  bio: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  isMe: boolean;
  isFollowing: boolean;
};

export default function UserProfile({
  user,
  isOwner,
}: {
  user: UserProfileModel;
  isOwner: boolean;
}) {
  return (
    <section className="flex items-center gap-4 p-4">
      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-200">
        {user.profileImage ? (
          <Image
            src={user.profileImage}
            alt={`${user.id} 프로필 이미지`}
            fill
            className="object-cover"
            unoptimized
          />
        ) : null}

        {isOwner ? (
          <>
            <div>본인 피드</div>
          </>
        ) : null}
      </div>

      <div>
        <div>
          <p className="text-lg font-semibold">{user.id}</p>
          <p className="text-sm text-gray-500">{user.id}</p>
        </div>
        <div className="flex">
          <div className="flex flex-col items-center">
            <span>게시물</span>
            <span className="text-sm text-gray-500">{user.postCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <span>팔로워</span>
            <span className="text-sm text-gray-500">{user.followerCount}</span>
          </div>
          <div className="flex flex-col items-center">
            <span>팔로잉</span>
            <span className="text-sm text-gray-500">{user.followingCount}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500">{user.bio}</p>
      </div>
    </section>
  );
}
