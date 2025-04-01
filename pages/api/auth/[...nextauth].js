import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
const URL = process.env.NEXT_PUBLIC_BASEURL + "staff/login";
const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;
        try {
          const response = await axios.post(URL, { email, password }, { headers: { "content-type": "application/json" } });
          const user = response.data?.data;
          if (response.statusText === "OK" && response.status === 200) {
            return user;
          }
        } catch (error) {
          throw new Error(error.response.data.message);
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
    error: '/auth/error',
    signOut: '/auth/signout'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          user_id: user?.id,
          token: user?.token,
          name: user?.name,
          email: user?.email,
          role:user?.role
        };
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          user_id: token?.user?.user_id,
          token: token?.user?.token,
          name: token?.user?.name,
          email: token?.user?.email,
          role:token?.user?.role
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
