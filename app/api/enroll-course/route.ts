import { db } from "@/config/db";
import { EnrollCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {

  if (!db) {
    return NextResponse.json("DB not initialized", { status: 500 });
  }

  try {
    const { courseID } = await req.json();

    const user = await currentUser();

    if (!user) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const result = await db.insert(EnrollCourseTable).values({
      courseID: courseID,
      userId: user?.primaryEmailAddress?.emailAddress ?? '',
      xpEarned: 0,
    }).returning();

    return NextResponse.json(result);

  } catch (e) {
    console.error(e);
    return NextResponse.json("Error enrolling course", { status: 500 });
  }
}