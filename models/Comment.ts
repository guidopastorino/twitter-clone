import mongoose, { Schema, Document, Types } from 'mongoose'
import { TargetContent } from '@/types/types'

export interface IComment extends Document {
  postReplyingId: Types.ObjectId;
  author_id: Types.ObjectId;
  comment: string;
  replyingTo: Types.ObjectId[];
  files?: object[];
  gif?: unknown;
  type?: TargetContent;
  likes?: Types.ObjectId[];
  comments?: Types.ObjectId[]; // ids de referencia a comentarios
  date: number; // timestamp
}

const CommentSchema: Schema = new Schema({
  postReplyingId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post'
  },
  author_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  comment: {
    type: String,
    required: true
  },
  replyingTo: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  ],
  files: {
    type: Array,
    default: [],
  },
  gif: {
    type: Schema.Types.Mixed,
  },
  type: {
    type: String,
    enum: ['post', 'reel', 'comment'],
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  date: {
    type: Number,
    required: true,
    default: Date.now,
  },
}, { timestamps: true })

const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema)

export default Comment;