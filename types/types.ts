// used for mongodb schemas
export type TargetContent = 'post' | 'reel' | 'comment'

export type LikesActivity = {
  author_id: string;
  date: number;
  type: TargetContent;
}

// Comments (hacer un comments props)
export type CommentsActivity = {
  postReplyingId: string;
  author_id: string;
  comment: string;
  replyingTo: string[];
  files?: object[];
  gif?: unknown;
  type?: TargetContent;
  likes: string[];
  comments?: string[];
  date: number; // timestamp
}

// Usuario
export interface UserType {
  _id: string;
  fullname: string;
  username: string;
  profileImage?: string;
  email: string;
  password?: string;
  provider?: string;
  currentRole?: string;
  description?: string;
  links: string[];
  location: string;
  privacy: {
    privateAccount: boolean;
    isSuspended: boolean;
    isVerified: boolean;
    isEnterprise: boolean;
    privateLikes: boolean;
    hasPremium: boolean;
    telephone?: string;
    emergencyEmail?: string;
  };
  activity: {
    likes: LikesActivity[];
    comments: string[];
  };
  followers: string[];
  highlights: {
    content: string;
    contentType: 'post' | 'reel';
  }[]; // Array of objects with references to either Post or Reel
  following: string[];
  blocked: string[];
  likes: string[];
  posts: string[];
  reels: string[];
  pinnedPost: string[];
  bookmarks?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Post
export type WhoCanReplyPost = 'Everyone' | 'Accounts you follow' | 'Verified accounts' | 'Only accounts you mention';

export type PostType = {
  _id: string;
  maskedId?: string;
  author_id: string;
  date?: number; // timestamp
  description: string;
  files: { url: string; type: string }[];
  likes: string[];
  comments: string[];
  saved: string[];
  whoCanReply: WhoCanReplyPost;
  repostedBy: string[];
  createdAt?: string;
  updatedAt?: string;
  bookmarks?: string[];
};