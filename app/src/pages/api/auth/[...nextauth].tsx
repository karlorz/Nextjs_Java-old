import { NextApiRequest, NextApiResponse } from "next";
import Credentials from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import type { AuthOptions } from "next-auth"
import apiAuthProvider from "@/utils/api";

const options: AuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        // username: { label: "Username", type: "text", placeholder: "jsmith" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const user = await apiAuthProvider(credentials);
        if (user.error) {
          throw new Error(user.error);
        } else {
          return user;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt"
  },

  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account?.expires_in && token.expires_at - Date.now() < 60000) {
        try {
          const response = await fetch("/api/v1/auth/refresh-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
          });
          const { accessToken, refreshToken, expiresAt } =
            await response.json();
          token.accessToken = accessToken;
          token.refreshToken = refreshToken;
          token.expires_at = expiresAt;
        } catch (error) {
          console.log(error);
        }
      }
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token, user }) {
      // session.user = token..token.
      // Send properties to the client, like an access_token and user id from a provider.
      // session.accessToken = token.accessToken;
      // session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
