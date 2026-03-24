import { db } from "@/config/db";
import {
  CompletedExerciseTable,
  CourseChaptersTable,
  CourseTable,
  EnrollCourseTable,
} from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq, asc, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const courseID = searchParams.get("courseID");

  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (courseID && courseID !== "enrolled") {
    const result = await db
      .select()
      .from(CourseTable)
      //@ts-ignore
      .where(eq(CourseTable.courseID, courseID));

    const chapters = await db
      .select()
      .from(CourseChaptersTable)
      //@ts-ignore
      .where(eq(CourseChaptersTable.courseID, courseID))
      .orderBy(asc(CourseChaptersTable.chapterId));

    const enrollCourse = await db
      .select()
      .from(EnrollCourseTable)
      .where(
        and(
          //@ts-ignore
          eq(EnrollCourseTable.courseID, courseID),
          eq(EnrollCourseTable.userId, userEmail)
        )
      );

    const completedExercises = await db
      .select()
      .from(CompletedExerciseTable)
      .where(
        and(
          //@ts-ignore
          eq(CompletedExerciseTable.courseID, courseID),
          //@ts-ignore
          eq(CompletedExerciseTable.userId, userEmail)
        )
      )
      .orderBy(
        desc(CompletedExerciseTable.courseID),
        desc(CompletedExerciseTable.exerciseId)
      );

    return NextResponse.json({
      ...result[0],
      chapters,
      userEnrolled: enrollCourse.length > 0,
      courseEnrolledInfo: enrollCourse[0],
      completedExercises,
    });
  }

  if (courseID === "enrolled") {
    const enrollCourses = await db
      .select()
      .from(EnrollCourseTable)
      .where(eq(EnrollCourseTable.userId, userEmail));

    if (enrollCourses.length === 0) {
      return NextResponse.json([]);
    }

    const courseIDs = enrollCourses.map((c) => c.courseID);

    const courses = await db
      .select()
      .from(CourseTable)
      //@ts-ignore
      .where(inArray(CourseTable.courseID, courseIDs));

    const chapters = await db
      .select()
      .from(CourseChaptersTable)
      //@ts-ignore
      .where(inArray(CourseChaptersTable.courseID, courseIDs))
      .orderBy(asc(CourseChaptersTable.chapterId));

    const completed = await db
      .select()
      .from(CompletedExerciseTable)
      //@ts-ignore
      .where(and(inArray(CompletedExerciseTable.courseID, courseIDs),
          eq(CompletedExerciseTable.userId, userEmail)
        )
      )
      .orderBy(
        desc(CompletedExerciseTable.courseID),
        desc(CompletedExerciseTable.exerciseId)
      );

    const formattedResult = courses.map((course) => {
      const courseEnrollInfo = enrollCourses.find(
        (e) => e.courseID === course.courseID
      );

      const courseChapters = chapters.filter(
        (ch) => ch.courseID === course.courseID
      );

      const courseCompleted = completed.filter(
        (cx) => cx.courseID === course.courseID
      );

      const totalExercises = courseChapters.reduce((acc, chapter) => {
        const count = Array.isArray(chapter.exercises)
          ? chapter.exercises.length
          : 0;
        return acc + count;
      }, 0);

      return {
        courseID: course.courseID,
        title: course.title,
        bannerImage: course.bannerImage,
        level: course.level,
        totalExercises,
        completedExercises: courseCompleted.length,
        xpEarned: courseEnrollInfo?.xpEarned || 0,
      };
    });

    return NextResponse.json(formattedResult);
  }

  const courses = await db.select().from(CourseTable);
  return NextResponse.json(courses);
}