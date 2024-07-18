// api/posts/route.ts
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { NextResponse } from "next/server";
import generateMaskedPostId from '@/utils/generateMaskedPostId'

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const posts = await Post.find().skip(skip).limit(limit);

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { author_id, description, files, whoCanReply } = await req.json();

    // Crear un objeto de post sin guardarlo aún
    const post = new Post({
      author_id,
      date: Date.now(),
      description,
      files,
      likes: [],
      comments: [],
      saved: [],
      whoCanReply,
      bookmarks: []
    });

    // Generar el maskedId antes de guardar el post
    const mongoId = post._id.toString();
    const maskedId = await generateMaskedPostId(mongoId);
    post.maskedId = maskedId;

    // Guardar el post en la base de datos
    await post.save();

    console.log("Masked id:", maskedId);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error en el endpoint POST:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, res: Response) {

}

export async function DELETE(req: Request, res: Response) {

}