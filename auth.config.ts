import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js config — no providers that touch the database (Prisma can't
 * run on the edge). The Credentials provider lives in `auth.ts` (Node runtime);
 * this shared config is what `middleware.ts` uses for session/JWT handling.
 */
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
