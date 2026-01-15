import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            const allowedEmail = process.env.ALLOWED_GOOGLE_ID;
            if (user.email === allowedEmail) {
                return true;
            }
            return false; // Access denied
        },
    },
    pages: {
        signIn: "/hong",
        error: "/hong", // Redirect to /hong on error
    },
});

export { handler as GET, handler as POST };
