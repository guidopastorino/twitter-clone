import mongoose, { Schema, Document, Types } from 'mongoose';
import { CommentsActivity, LikesActivity } from '@/types/types';

export interface IUser extends Document {
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
    comments: Types.ObjectId[];
  };
  followers: Types.ObjectId[];
  highlights: {
    content: Types.ObjectId;
    contentType: 'post' | 'reel';
  }[]; // Array of objects with references to either Post or Reel
  following: Types.ObjectId[];
  blocked: Types.ObjectId[];
  likes: Types.ObjectId[];
  posts: Types.ObjectId[];
  reels: Types.ObjectId[];
  pinnedPost: Types.ObjectId[];
  bookmarks?: string[];
}

const UserSchema: Schema = new Schema(
  {
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    profileImage: { type: String },
    email: { type: String, required: true },
    password: { type: String, default: "" },
    provider: { type: String },
    currentRole: { type: String },
    description: { type: String },
    links: { type: [String] }, // Array of strings
    location: { type: String },
    privacy: {
      privateAccount: { type: Boolean },
      isSuspended: { type: Boolean },
      isVerified: { type: Boolean },
      isEnterprise: { type: Boolean },
      privateLikes: { type: Boolean },
      hasPremium: { type: Boolean },
      telephone: { type: String },
      emergencyEmail: { type: String },
    },
    activity: {
      likes: {
        type: [{
          author_id: { type: String },
          date: { type: Number },
          type: { type: { string: { type: String, enum: ['post', 'reel', 'comment'] } } },
        }],
        default: [],
      },
      comments: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        default: [],
      },
    },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    highlights: [{
      content: { type: Schema.Types.ObjectId, required: true },
      contentType: { type: String, enum: ['post', 'reel'], required: true },
    }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    blocked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'Post' }], // Assuming Post is the model name
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    reels: [{ type: Schema.Types.ObjectId, ref: 'Reel' }], // Assuming Reel is the model name
    pinnedPost: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    bookmarks: { type: [Schema.Types.ObjectId], default: [] },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;