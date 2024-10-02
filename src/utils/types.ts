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

export enum NotificationContentType {
  POST = 'Post',
  LIKE = 'Like',
  COMMENT = 'Comment',
  USER = 'User',
}

// Content interfaces
export interface NotificationContentPost {
  _id: string; // Post ID
}

export interface NotificationContentLike {
  _id: string; // Like ID
  createdAt: string; // Like creation date
}

export interface NotificationContentComment {
  _id: string; // Comment ID
  content: string; // The content of the comment
}

export enum NotificationType {
  POST = 'POST',
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',
  DIRECT_MESSAGE = 'DIRECT_MESSAGE',
}

// Conditional type to determine the content type based on contentType
export type NotificationContent<T extends NotificationContentType> =
  T extends NotificationContentType.POST
    ? NotificationContentPost
    : T extends NotificationContentType.LIKE
    ? NotificationContentLike
    : T extends NotificationContentType.COMMENT
    ? NotificationContentComment
    : never;

// Generic notification interface
export interface NotificationGeneric<T extends NotificationContentType> {
  _id: string;
  message: string;
  isRead: boolean;
  contentType: T;
  type: NotificationType;
  sender: User;
  content: NotificationContent<T>;
}

// Union type for all possible notification types
export type AnyNotification =
  | NotificationGeneric<NotificationContentType.POST>
  | NotificationGeneric<NotificationContentType.LIKE>
  | NotificationGeneric<NotificationContentType.COMMENT>;

// Now you can use this type for an array of notifications
export type NotificationArray = AnyNotification[];
