// pages/api/auth/[...nextauth].ts
import { NextApiHandler } from "next";
import NextAuth, { Session, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import prisma from "../../../lib/prisma";

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    GitHubProvider({
      clientId:
        process.env.GITHUB_ID !== undefined ? process.env.GITHUB_ID : "",
      clientSecret:
        process.env.GITHUB_SECRET !== undefined
          ? process.env.GITHUB_SECRET
          : "",
    }),
  ],
  callbacks: {
    session: ({ session, user }: { session: Session; user: User }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        email: user.email,
      },
    }),
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
};
