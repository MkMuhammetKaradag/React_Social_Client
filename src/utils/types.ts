export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  profilePhoto?: string;
}

export interface UserWithFollowStatus extends User {
  isFollowing: boolean;
}

export interface ProfileData extends UserWithFollowStatus {
  chatId: string | null;
  createdAt: string | null;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  restricted: boolean;
  followRequestIsSent: boolean;
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}
export interface Media {
  url: string;
  type: MediaType;
  publicId: string;
}

export interface BasePost {
  _id: string;
  user: User;
  media: Media[];
  title: string;
  tags: string[];
}

export interface HomePageCardPost extends BasePost {
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
}
export interface PostPageCardPost extends BasePost {
  createdAt: string;
  commentCount: number;
  isLiked: boolean;
  likeCount: number;
}

export interface ExplorePageCardPost {
  _id: string;
  score: number;
  commentCount: number;
  likeCount: number;
  firstMedia: Media;
}

export interface Sender {
  _id: string;
  userName: string;
  profilePhoto: string | null;
}

export interface Message {
  _id: string;
  content: string;
  sender: Sender;
}

export interface FollowRequest {
  _id: string;
  status: string;
}

export interface GetFollowingRequest extends FollowRequest {
  to: User;
}
export interface GetFollowRequest extends FollowRequest {
  from: User;
}
