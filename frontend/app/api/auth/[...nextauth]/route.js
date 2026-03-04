import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google-session`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-nextauth-secret": process.env.NEXTAUTH_SECRET,
              },
              body: JSON.stringify({ email: profile.email, name: profile.name }),
            }
          );
          if (res.ok) {
            const data = await res.json();
            token.backendToken = data.token;
          }
        } catch (err) {
          console.error("[NextAuth] Failed to get backend token:", err);
        }      }
      return token;
    },
    async session({ session, token }) {
      session.backendToken = token.backendToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
