import { db } from "@/config/db";
import { CourseChaptersTable, CourseTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url);
  const courseID = searchParams.get("courseID");

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


    return NextResponse.json({

      ...result[0],
      chapters: chapterResult });

  } else {

    const result = await db.select().from(CourseTable);
    return NextResponse.json(result);

  }
}