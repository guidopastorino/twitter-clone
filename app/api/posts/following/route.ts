import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { UserType } from '@/types/types';
import { NextResponse } from 'next/server';

export async function GET(req: Request, res: Response) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    console.log("userId: ", userId)

    const user = await User.findById(userId).populate('following');

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const followingIds = user.following.map((follow: UserType) => follow._id);
    const posts = await Post.find({ author_id: { $in: followingIds } }).sort({ date: -1 });

    return NextResponse.json(posts, { status: 200 })

  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 })

  }
}
