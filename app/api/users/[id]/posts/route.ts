// Ruta para manipular los posts de un usuario (array de user.posts)

import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }, res: NextResponse) {
  try {
    // id del usuario
    const { id } = params

    if (!id) {
      return NextResponse.json({ error: "User id is required" }, { status: 400 })
    }

    const user = await User.findById(id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user.posts, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}