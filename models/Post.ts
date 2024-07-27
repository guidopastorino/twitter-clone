import mongoose, { Schema, Document, Types } from 'mongoose';
import { CommentsActivity, WhoCanReplyPost } from '@/types/types';

interface IPost extends Document {
  author_id: Types.ObjectId;
  maskedId: string;
  date: number; // timestamp
  description: string;
  files: { url: string; type: string }[]; // Estructura para archivos con URL y tipo
  likes: Types.ObjectId[]; // array of _id Types.ObjectId
  comments: Types.ObjectId[];
  saved: Types.ObjectId[]; // Array of _id Types.ObjectId (saved by)
  whoCanReply: WhoCanReplyPost;
  repostedBy: Types.ObjectId[];
  bookmarks: Types.ObjectId[];
}

const PostSchema: Schema = new Schema(
  {
    author_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    maskedId: {
      type: String,
      unique: true,
      required: true
    },
    date: {
      type: Number,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
    },
    files: [
      {
        url: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        default: []
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
      default: [],
    },
    saved: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    whoCanReply: {
      type: String,
      enum: ['Everyone', 'Accounts you follow', 'Verified accounts', 'Only accounts you mention'],
      default: 'Everyone',
    },
    repostedBy: {
      type: [Schema.Types.ObjectId],
      required: true,
      default: []
    },
    bookmarks: {
      type: [Schema.Types.ObjectId],
      required: true,
      default: []
    }
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

// Creación del modelo
const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
