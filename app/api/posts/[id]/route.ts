import Post from '@/models/Post'
import dbConnect from '@/lib/mongodb'
import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    console.log("id: ", id);

    await dbConnect();

    if (!id) {
      return NextResponse.json({ error: "Post id is required" }, { status: 400 }); // Bad Request
    }

    let post = await Post.findOne({ maskedId: id });

    if(!ObjectId.isValid(id)){
      return NextResponse.json({ error: "Invalid id" }, { status: 400 }); // Bad Request
    }
    
    if (!post) {
      post = await Post.findById(id);
    }

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 }); // Not Found
    }

    return NextResponse.json(post, { status: 200 }); // OK
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: error instanceof Error  ? error.message : 'Internal Server Error' }, { status: 500 }); // Internal Server Error
  }
}

export async function POST(req: Request, res: Response) {

}

export async function PUT(req: Request, res: Response) {

}

export async function DELETE(req: Request, res: Response) {

}