import { integer, json, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  points: integer().default(0),
  subscription: varchar(),
});


export const CourseTable=pgTable("courses",{

  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  courseID: integer().notNull().unique(),
  title: varchar().notNull(),
  desc: varchar().notNull(),
  bannerImage: varchar().notNull(),
  level: varchar().default('beginner'),
  tags: varchar(),
})


export const CourseChaptersTable=pgTable('courseChapters',{

  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  chapterID: integer(),
  courseID: integer().notNull(),
  name: varchar(),
  desc: varchar(),
  exercises: json(),
})


export const EnrollCourseTable=pgTable('enrollCourse',{
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  courseID:integer(),
  userId:varchar(),
  enrolledDate:timestamp().defaultNow(),
  xpEarned:integer(),
})