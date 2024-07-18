// Ruta para manejar los comentarios de un post

import dbConnect from "@/lib/mongodb";
import Comment from "@/models/Comment";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose'

// Ruta para obtener los comentarios de un post
// id: post id
export async function GET(req: NextRequest, { params }: { params: { id: string } }, res: NextResponse) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Post id is required" }, { status: 400 });
    }

    let post = null;

    // Check if the id is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      post = await Post.findById(id);
    }

    // If post is not found by id, try to find by maskedId
    if (!post) {
      post = await Post.findOne({ maskedId: id });
    }

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const commentsId = post.comments;

    // Retrieve the comments
    const comments = await Promise.all(
      commentsId.map(async (commentId: string) => {
        const comment = await Comment.findById(commentId);
        return comment;
      })
    );

    // Shuffle comments array
    const shuffledComments = comments.sort(() => Math.random() - 0.5);

    return NextResponse.json(shuffledComments, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}


// Ruta para publicar un comentario
// id: post id which user is replying
// author_id: user id replying
export async function POST(req: NextRequest, { params }: { params: { id: string } }, res: NextResponse) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "Post id is required" }, { status: 400 })
    }

    const { postReplyingId, author_id, comment, replyingTo, files, gif, type, date } = await req.json()

    if (!author_id || !comment) {
      return NextResponse.json({ error: "User id and comment is required" }, { status: 400 })
    }

    await dbConnect()

    const post = await Post.findById(id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const user = await User.findById(author_id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const newComment = new Comment({
      postReplyingId,
      author_id,
      comment,
      replyingTo,
      files: files || [],
      gif: gif || null,
      type,
      likes: [],
      comments: [],
      date: date || Date.now(),
    })

    await newComment.save()

    // agregar el id del comentario al post y a la actividad del usuario
    post.comments.push(newComment._id)
    user.activity.comments.push(newComment._id)

    // guardar cambios
    await user.save()
    await post.save()

    return NextResponse.json({ message: "Post commented successfully", comment: newComment }, { status: 201 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}