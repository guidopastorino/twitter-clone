import User from "@/models/User";
import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  // 'id' could be the following fields: '_id' or 'username'
  const { id } = params;

  try {
    let user = null;
    
    // Try searching user by _id
    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await User.findById(id);
    }

    // If there is no user, find by username
    if (!user) {
      user = await User.findOne({ username: id })
    }

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error fetching user", error }), { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  const { id } = params;
  const body = await req.json();

  try {
    const newUser = new User({ ...body, _id: id });
    await newUser.save();
    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error creating user", error }), { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  const { id } = params;
  const body = await req.json();

  try {
    const updatedUser = await User.findByIdAndUpdate(id, body, { new: true });
    if (!updatedUser) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error updating user", error }), { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  const { id } = params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: "User deleted successfully" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error deleting user", error }), { status: 500 });
  }
}
