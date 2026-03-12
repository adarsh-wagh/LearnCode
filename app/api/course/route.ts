import { db } from "@/config/db";
import {
  CompletedExerciseTable,
  CourseChaptersTable,
  CourseTable,
  EnrollCourseTable
} from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url);
  const courseID = searchParams.get("courseID");

  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  if (courseID) {

    const numericCourseID = Number(courseID);

    const courseResult = await db
      .select()
      .from(CourseTable)
      .where(eq(CourseTable.courseID, numericCourseID));

    const chapterResult = await db
      .select()
      .from(CourseChaptersTable)
      .where(eq(CourseChaptersTable.courseID, numericCourseID))
      .orderBy(asc(CourseChaptersTable.chapterId)); // FIXED ORDER

    const enrollCourse = await db
      .select()
      .from(EnrollCourseTable)
      .where(
        and(
          //@ts-ignore
          eq(EnrollCourseTable.courseID, numericCourseID),eq(EnrollCourseTable.userId, userEmail)
        )
      );

    const isEnrolledCourse = enrollCourse.length > 0;

    const completedExercises = await db
      .select()
      .from(CompletedExerciseTable)
      .where(
        and(
          eq(CompletedExerciseTable.courseID, numericCourseID),
          //@ts-ignore
          eq(CompletedExerciseTable.userId, userEmail)
        )
      )
      .orderBy(
        desc(CompletedExerciseTable.courseID),
        desc(CompletedExerciseTable.exerciseId)
      );

    return NextResponse.json({
      ...courseResult[0],
      chapters: chapterResult,
      userEnrolled: isEnrolledCourse,
      courseEnrolledInfo: enrollCourse[0],
      completedExercises: completedExercises
    });

  } else {

    const courses = await db.select().from(CourseTable);

    return NextResponse.json(courses);

  }
}