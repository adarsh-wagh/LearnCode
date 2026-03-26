"use client"
import axios from "axios";
import { ChartNoAxesColumnIncreasingIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';

export type Course = {
  id: number,
  courseID: number,
  title: string,
  desc: string,
  level: string,
  bannerImage: string,
  tag: string,
  chapters?: Chapter[],
  userEnrolled?: boolean,
  courseEnrolledInfo?: CourseEnrolledInfo,
  completedExercises?: CompletedExercises[],
}

export type CompletedExercises = {
  chapterId: number,
  courseID: number,
  exerciseId: number,
}

export type CourseEnrolledInfo = {
  xpEarned: number,
  enrolledDate: any,
}

export type Chapter = {
  chapterId: number,
  courseID: number,
  desc: string,
  name: string,
  id: number,
  exercises: exercises[]
}

export type exercises = {
  name: string,
  slug: string,
  xp: number,
  difficulty: string,
}

function CourseList() {

  const [courseList, setCourseList] = useState<Course[]>([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetAllCourses();
  }, [])

  const GetAllCourses = async () => {
    try {
      setLoading(true);

      const result = await axios.get('/api/course');
      const data = result?.data;

      setCourseList(Array.isArray(data) ? data : []);

    } catch (error) {
      console.log("Error fetching courses:", error);
      setCourseList([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-3">

      {!loading && courseList.length === 0 && (
        <p className="text-slate-400">No courses available</p>
      )}

      {courseList.map((course, index) => (

        <Link href={'/courses/' + course?.courseID} key={index}>

          <div className="border-2 rounded-xl hover:bg-slate-900 cursor-pointer">

            <Image
              src={(course?.bannerImage || "").trimEnd()}
              width={400}
              height={400}
              alt={course?.title}
              loading="eager"
              priority
              className="w-full h-[200px] object-cover rounded-t-xl"
            />

            <div className="font-game p-4">

              <h2 className="text-2xl">{course?.title}</h2>
              <p className="text-xl text-slate-400 line-clamp-2">{course?.desc}</p>

              <h2 className="bg-slate-900 flex gap-2 p-1 px-4 mt-3 rounded-2xl items-center inline-flex">
                <ChartNoAxesColumnIncreasingIcon className="h-4 w-4" />
                {course?.level}
              </h2>

            </div>

          </div>
        </Link>
      ))}
    </div>
  )
}

export default CourseList