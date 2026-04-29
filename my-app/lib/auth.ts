// NextAuth v5 Konfiguration mit Credentials Provider

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-Mail", type: "email" },
        password: { label: "Passwort", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        console.log("Auth authorize called for:", email);

        try {
          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) {
            console.log("User nicht gefunden:", email);
            return null;
          }

          const passwordKorrekt = await bcrypt.compare(password, user.password);
          if (!passwordKorrekt) {
            console.log("Passwort falsch für:", email);
            return null;
          }

          console.log("Login erfolgreich für:", email);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Auth Fehler:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
