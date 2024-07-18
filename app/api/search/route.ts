import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get('q');
    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    const normalizedQuery = query.trim().toLowerCase();
    const regex = new RegExp(normalizedQuery.split('').join('.*'), 'i'); // regex flexible (no estricta)

    await dbConnect();

    const usersResult = await User.find({
      $or: [
        { username: { $regex: regex } },
        { fullname: { $regex: regex } }
      ]
    });

    const postsResult = await Post.find({
      description: { $regex: regex }
    });

    return NextResponse.json({ results: { users: usersResult, posts: postsResult } }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch search results" }, { status: 500 });
  }
}
