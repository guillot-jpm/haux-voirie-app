import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { resend } from "@/lib/resend";
import MagicLinkEmail from "@/emails/MagicLinkEmail";
import { render } from "@react-email/render";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      from: "Haux Alerte <notifications@haux-alerte.fr>",
      async sendVerificationRequest({ identifier: email, url }) {
        const emailHtml = await render(MagicLinkEmail({ url }));

        await resend.emails.send({
          from: "Haux Alerte <notifications@haux-alerte.fr>",
          to: email,
          subject: "Votre lien de connexion à Haux Alerte",
          html: emailHtml,
        });
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  }
};
