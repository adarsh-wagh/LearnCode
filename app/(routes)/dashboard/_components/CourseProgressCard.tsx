import React from 'react'
import { EnrolledCourseInfo } from './EnrolledCourses'
import Image from 'next/image'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

type Props={
    course: EnrolledCourseInfo}

function CourseProgressCard({ course }: Props) {
  return (
     <Link href={'/courses/'+course?.courseID}>
      <div className='border-4 rounded-2xl overflow-hidden '>
       
        <Image src={course?.bannerImage?.trimEnd()} alt={course?.title} 
        width={500} height={500}
        className='w-full h-[170px] rounded-t-xl object-cover' />
        <div className='font-game p-4'>
            <h2 className='text-lg font-light text-slate-500 mb-[-10px] mt-[-10px]'>Course:</h2>
          
           <div className='float flex justify-between items-center'>
            <h2 className='text-3xl'>{course?.title}</h2>
            <h2 className='text-lg font-light text-slate-500'>{course?.completedExercises}/{course?.totalExercises}</h2>
           </div> 

            <Progress value={(course?.completedExercises / course?.totalExercises) * 100} />
            
        </div>
        
    </div>
    </Link>
  )
}

export default CourseProgressCard