import { db } from "@/config/db";
import { CompletedExerciseTable, EnrollCourseTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {

  if (!db) {
    return NextResponse.json("DB not initialized", { status: 500 });
  }

  try {
    const { courseID, chapterId, exerciseId, xpEarned } = await req.json();

    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Check already completed
    const existing = await db
      .select()
      .from(CompletedExerciseTable)
      .where(
        and(
          eq(CompletedExerciseTable.userId, userEmail),
          eq(CompletedExerciseTable.courseID, courseID),
          eq(CompletedExerciseTable.exerciseId, exerciseId)
        )
      );

    if (existing.length > 0) {
      return NextResponse.json({ message: "Already completed" });
    }

    // ✅ Insert completion
    const result = await db.insert(CompletedExerciseTable).values({
      userId: userEmail,
      courseID,
      chapterId,
      exerciseId
    }).returning();

    // ✅ Update course XP (ONLY for this user)
    await db.update(EnrollCourseTable)
      .set({
        xpEarned: sql`${EnrollCourseTable.xpEarned} + ${xpEarned}`
      })
      .where(
        and(
          eq(EnrollCourseTable.courseID, courseID),
          eq(EnrollCourseTable.userId, userEmail) // 🔥 FIXED (was missing)
        )
      );

    // ✅ Update user XP
    await db.update(usersTable)
      .set({
        points: sql`${usersTable.points} + ${xpEarned}`
      })
      .where(eq(usersTable.email, userEmail));

    return NextResponse.json(result);

  } catch (e) {
    console.error(e);
    return NextResponse.json("Error completing exercise", { status: 500 });
  }
}