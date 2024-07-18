import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/clientPromise";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        const { email, password } = credentials;

        await dbConnect();
        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
          return user;
        }

        throw new Error("Invalid credentials");
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    // async signIn({ user, account, profile }) {
    //   console.log("signIn callback triggered");
    //   if (!account) {
    //     console.log("No account information found");
    //     return false;
    //   }

    //   await dbConnect();
    //   const existingUser = await User.findOne({ email: user.email });

    //   if (!existingUser) {
    //     const username = user.email ? user.email.split('@')[0] : user.id;
    //     const newUser = new User({
    //       fullname: user.name,
    //       email: user.email,
    //       username,
    //       profileImage: user.image || "/default_profile_picture.jpg",
    //       password: "", // Setting an empty string for password as it's not required for OAuth
    //       provider: account.provider,
    //       currentRole: "",
    //       description: "",
    //       links: [],
    //       privacy: {
    //         privateAccount: false,
    //         isSuspended: false,
    //         isVerified: false,
    //         isEnterprise: false,
    //         privateLikes: false,
    //         hasPremium: false,
    //         telephone: "",
    //         emergencyEmail: "",
    //       },
    //       activity: {
    //         likes: [],
    //         comments: [],
    //       },
    //       followers: [],
    //       highlights: [],
    //       following: [],
    //       blocked: [],
    //       likes: [],
    //       posts: [],
    //       reels: [],
    //       pinnedPost: [],
    //     });

    //     try {
    //       await newUser.save();
    //       console.log("New user created:", newUser);
    //     } catch (error) {
    //       console.error("Error creating new user:", error);
    //       return false;
    //     }
    //   } else {
    //     console.log("Existing user found:", existingUser);
    //   }

    //   return true;
    // },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
