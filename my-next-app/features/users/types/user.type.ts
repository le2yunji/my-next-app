export type UserProfileItem = {
  _id: string;
  userId: string;
  name: string;
  profileImage: string | null;
  bio: string;
  postCount: number;
  boardCount: number;
  interestCategories: string[];
  customInterestCategories: string[];
  followerCount: number;
  followingCount: number;
  isMe: boolean;
  isFollowing: boolean;
};
