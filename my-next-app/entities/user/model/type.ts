export type User = {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  createdAt: Date;
};

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
