import { db } from "@/config/db";
import { CompletedExerciseTable, EnrollCourseTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { courseID, chapterId, exerciseId, xpEarned } = await req.json();
  const user = await currentUser();

  const userEmail = user?.primaryEmailAddress?.emailAddress;

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  // ✅ INSERT only if not completed
  const result = await db.insert(CompletedExerciseTable).values({
    userId: userEmail,
    courseID,
    chapterId,
    exerciseId
  }).returning();

  // ✅ UPDATE course XP (only once now)
  await db.update(EnrollCourseTable)
    .set({
      xpEarned: sql`${EnrollCourseTable.xpEarned} + ${xpEarned}`
    })
    .where(eq(EnrollCourseTable.courseID, courseID));

  // ✅ UPDATE user XP
  await db.update(usersTable)
    .set({
      points: sql`${usersTable.points} + ${xpEarned}`
    })
    .where(eq(usersTable.email, userEmail));

  return NextResponse.json(result);
}