import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {

  if (!db) {
    return NextResponse.json("DB not initialized", { status: 500 });
  }

  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.primaryEmailAddress?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: "No email found" }, { status: 400 });
    }

    // ✅ Check if user exists
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    // ✅ Create new user
    if (users.length === 0) {
      const newUser = {
        name: user.fullName ?? '',
        email: email,
        points: 0
      };

      const result = await db
        .insert(usersTable)
        .values(newUser)
        .returning();

      return NextResponse.json(result[0]);
    }

    // ✅ Return existing user
    return NextResponse.json(users[0]);

  } catch (e) {
    console.error(e);
    return NextResponse.json("Error handling user", { status: 500 });
  }
}