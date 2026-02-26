"use client"
import axios from "axios";
import { ChartNoAxesColumnIncreasingIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from 'react'

type Course={
    id:number,
    courseId:number,
    title:string,
    desc:string,
    level:string,
    bannerImage:string,
    tag:string,
}

function CourseList() {
    
    const [courseList, setCourseList] = useState<Course[]>([])
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
        GetAllCourses();
    },[])

    const GetAllCourses=async()=>{
        setLoading(true)
        const result=await axios.get('/api/course')
        console.log(result);
        setCourseList(result?.data);
        setLoading(false);
    }

  return (
    <div className="grid grid-col-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 mt-3">
        {courseList?.map((course,index)=>(

            <div key={index} className="border-2 rounded-xl hover:bg-slate-900 cursor-pointer">

                <Image src={(course?.bannerImage).trimEnd()} width={400} height={400}
                alt={course?.title}
                className="w-full h-[200px] object-cover rounded-t-xl"/>

                <div className="font-game p-4">

                    <h2 className="text-2xl">{course?.title}</h2>
                    <p className="text-xl text-slate-400 line-clamp-2">{course?.desc}</p>

                    <h2  className="bg-slate-900 flex gap-2 p-1 px-4 mt-3 rounded-2xl items-center inline-flex">
                        <ChartNoAxesColumnIncreasingIcon className="h-4 w-4"/>
                        {course?.level}
                    </h2>

                </div>

            </div>
        ))}
    </div>
  )
}

export default CourseList