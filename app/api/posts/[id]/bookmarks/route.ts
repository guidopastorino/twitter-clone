// api/posts/:postId/bookmarks
// Obtiene el estado del bookmark (GET) mediante un id del usuario y retorna si le dio bookmark o no
// Actualiza su estado (POST) mediante un id del usuario y agrega los ids (usuario y post) a cada esquema de cada uno, o los elimina, si es que no guardó el post

import Post from '@/models/Post';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

// ruta para obtener el estado del bookmark
// GET /api/posts/:postId/bookmarks
// params : {id} -> id del post
//          {userId} -> id del usuario a verificar si ha guardado el post o no

export async function GET(req: NextRequest, { params }: { params: { id: string } }, res: NextResponse) {
  try {
    // Recupera los parámetros de la consulta
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 })
    }

    const { id } = params;

    await dbConnect();

    const post = await Post.findById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const bookmarks = post.bookmarks
    const bookmarked = bookmarks.includes(userId)
    return NextResponse.json({ bookmarked }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ruta para actualizar el estado del bookmark
// si se envía bookmark: true, entonces se agrega, si se envía bookmark: false, se elimina (ambos ids)
// POST /api/posts/:postId/bookmarks
// body: { bookmark: newBookmarkStatus } -> status (boolean) indicando si el usuario ha guardado previamente o no el bookmark

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { bookmark, userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 });
    }

    console.log('UserId:', userId);
    console.log('PostId:', id);
    console.log('Bookmark status:', bookmark);

    await dbConnect();

    const post = await Post.findById(id);
    const user = await User.findById(userId);

    if (!post || !user) {
      return NextResponse.json({ error: "Post or user not found" }, { status: 404 });
    }

    let bookmarkState = "";

    // handle bookmark status
    if (bookmark) {
      if (!post.bookmarks.includes(userId)) {
        post.bookmarks.push(userId);
      }
      if (!user.bookmarks.includes(id)) {
        user.bookmarks.push(id);
      }
      bookmarkState = "Added";
    } else {
      post.bookmarks = post.bookmarks.filter((uid: string) => uid.toString() != userId);
      user.bookmarks = user.bookmarks.filter((pid: string) => pid.toString() != id);
      bookmarkState = "Removed";
    }

    // save changes
    await post.save();
    await user.save();

    return NextResponse.json({
      success: true,
      postBookmarks: post.bookmarks,
      userBookmarks: user.bookmarks,
      bookmarkState
    }, { status: 200 });
  } catch (error) {
    console.log('Server error:', error);
    return NextResponse.json({ error: (error instanceof Error) ? error.message : "Unknown error" }, { status: 500 });
  }
}