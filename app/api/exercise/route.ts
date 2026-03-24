import { db } from "@/config/db";
import { and, eq } from "drizzle-orm";
import { CompletedExerciseTable, CourseChaptersTable, ExerciseTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { courseID, chapterId, exerciseId } = await req.json();

  const courseResult = await db
    .select()
    .from(CourseChaptersTable)
    .where(
      and(
        eq(CourseChaptersTable.courseID, courseID),
        eq(CourseChaptersTable.chapterId, chapterId)
      )
    );

  const exerciseResult = await db
    .select()
    .from(ExerciseTable)
    .where(
      and(
        eq(ExerciseTable.courseID, courseID),
        eq(ExerciseTable.chapterId, chapterId),
        eq(ExerciseTable.exerciseId, exerciseId)
      )
    );

    const CompletedExercise = await db.select().from(CompletedExerciseTable)
    .where(
      and(
        eq(CompletedExerciseTable?.courseID, courseID),
        eq(CompletedExerciseTable?.chapterId, chapterId),
      )
    );

  return NextResponse.json({
    ...courseResult[0],
    exerciseData: exerciseResult[0],
    CompletedExercise: CompletedExercise
  });
}