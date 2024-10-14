import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import getTokenFromApiServer from "./googleauth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider === "google") {
        const googleUser = {
          email: user.email,
          // name: user.name,
        };

        account.access_token = await getTokenFromApiServer(
          "google",
          googleUser
        );

        // console.log(account.access_token);

        return true;
      }
      return true;
    },
    jwt({ token, user, account }) {
      // if (user) {
      //   token = { ...token, accessToken: account?.accessToken };
      //   return { ...token, accessToken: account?.access_token };
      // }
      // return token;
      if (account?.provider === "google") {
        return { ...token, accessToken: account.access_token };
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};