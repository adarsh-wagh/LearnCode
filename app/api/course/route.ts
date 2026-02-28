import { db } from "@/config/db";
import { CourseChaptersTable, CourseTable, EnrollCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url);
  const courseID = searchParams.get("courseID");
  const user=await currentUser();
  if (courseID) {

    const result = await db
      .select()
      .from(CourseTable)
      .where(eq(CourseTable.courseID, Number(courseID)));

    const chapterResult = await db
      .select()
      .from(CourseChaptersTable)
      //@ts-ignore
      .where(eq(CourseChaptersTable.courseID,courseID)); 

      const enrollCourse=await db.select().from(EnrollCourseTable)
      //@ts-ignore
      .where(and(eq(EnrollCourseTable?.courseID,courseID),eq(EnrollCourseTable.userId,user?.primaryEmailAddress?.emailAddress)))

    const isEnrolledCourse=enrollCourse?.length>0?true:false

    return NextResponse.json({

      ...result[0],
      chapters: chapterResult,
      userEnrolled:isEnrolledCourse,
      courseEnrolledInfo: enrollCourse[0],
    });

  } else {

    const result = await db.select().from(CourseTable);
    return NextResponse.json(result);

  }
}