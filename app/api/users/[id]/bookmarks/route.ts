// /api/users/:userId/bookmarks
// Retorna los bookmarks del usuario (array de posts)
// Funcionamiento: hace fetch de los bookmarks del usuario (string[]), y luego crea un nuevo array 'posts' que mapea cada id a su post (PostType[])

import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }, res: NextResponse) {
  try {
    const { id } = params

    console.log("User id: ", id);

    if (!id) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 })
    }

    await dbConnect()

    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const bookmarks = user.bookmarks

    const posts = await Promise.all(
      bookmarks.map(async (postId: string) => {
        const post = await Post.findById(postId);
        return post;
      })
    );

    return NextResponse.json(posts, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}



// Ruta para eliminar todos los bookmarks de un usuario
// id: id del usuario
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }, res: NextResponse) {
  try {
    const { id } = params

    console.log("User id: ", id);

    if (!id) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 })
    }

    await dbConnect()

    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // lista de id de posts
    const bookmarks = user.bookmarks

    // lo que hay que hacer es, como el usuario tiene guardado en bookmarks los posts que guardó, entonces, cada post va a tener en sus bookmarks el id del usuario que lo guardó (que debe estar el usuario con el id 'id')

    for (const postId of bookmarks) {
      const post = await Post.findById(postId)
      if (post) {
        post.bookmarks = post.bookmarks.filter((uid: string) => uid != id)
        await post.save()
      }
    }

    user.bookmarks = []

    await user.save()

    return NextResponse.json({ message: "Bookmarks cleared successfully", bookmarks: user.bookmarks }, { status: 200 })
  } catch (error) {
    console.log("Error removing bookmarks: ", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}