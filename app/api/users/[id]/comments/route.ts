import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Comment from "@/models/Comment";
import { ObjectId } from "mongodb";

// /api/users/:userId/comments
// Get all comments from a user
// id: user id
export async function GET(req: NextRequest, { params }: { params: { id: string } }, res: NextResponse) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "User id is required" }, { status: 401 })
    }

    await dbConnect()

    const filter = ObjectId.isValid(id) ? { _id: id } : { username: id }

    // id puede ser: '_id' o 'username'
    const user = await User.findOne(filter)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const commentsId = user.activity.comments

    // Obtenemos la información de cada comentario
    const comments = await Promise.all(
      commentsId.map(async (commentId: string) => {
        const comment = await Comment.findById(commentId)
        return comment;
      })
    )

    return NextResponse.json(comments, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}