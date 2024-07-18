import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

// Fetch users data
// Function to fetch users data by an array of user ids
// Returns an array of objects which represents data of each user 
// usage example: http://localhost:3000/api/users?userIds=someUserId1&userIds=someUserId2
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userIds = searchParams.getAll('userIds');

    if (!userIds.length) {
      return NextResponse.json({ error: "User ids are required" }, { status: 400 });
    }

    const users = await Promise.all(
      userIds.map(async (userId: string) => {
        // Verifica que el userId sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error(`Invalid userId: ${userId}`);
        }

        const user = await User.findById(userId);
        return user.username; // retornar o el objeto 'user' o su usuario 'user.username'
      })
    );

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(req: Request, res: Response) {
  try {
    const { fullname, username, email, password } = await req.json();
    await dbConnect();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
      profileImage: '',
      provider: '',
      currentRole: '',
      description: '',
      links: [],
      location: '',
      privacy: {
        privateAccount: false,
        isSuspended: false,
        isVerified: false,
        isEnterprise: false,
        privateLikes: false,
        hasPremium: false,
        telephone: '',
        emergencyEmail: '',
      },
      activity: {
        likes: [],
        comments: [],
      },
      followers: [],
      highlights: [],
      following: [],
      blocked: [],
      likes: [],
      posts: [],
      reels: [],
      pinnedPost: [],
      bookmarks: []
    });

    await newUser.save();
    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(req: Request, res: Response) {
  return NextResponse.json({ user: { _id: "odo23nd129d13874h1", username: "guidopastorino" } }, { status: 200 })
}

export async function DELETE(req: Request, res: Response) {
  return NextResponse.json({ user: { _id: "odo23nd129d13874h1", username: "guidopastorino" } }, { status: 200 })
}