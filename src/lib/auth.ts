import { getServerSession } from "next-auth";

export async function checkAuth() {
    const session = await getServerSession();
    if (!session || session.user?.email !== process.env.ALLOWED_GOOGLE_ID) {
        throw new Error("Unauthorized");
    }
}
