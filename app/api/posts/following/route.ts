import dbConnect from '@/lib/mongodb';
import Post from '@/models/Post';
import User from '@/models/User';
import { UserType } from '@/types/types';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const skip = (page - 1) * limit;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const user = await User.findById(userId).populate('following');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const followingIds = user.following.map((follow: UserType) => follow._id);
    const posts = await Post.find({ author_id: { $in: followingIds } })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}