import { Progress } from '@/components/ui/progress'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Course } from '../../_components/CourseList'

type Props={
    courseDetail: Course | undefined
}

function CourseStatus({courseDetail}:Props) {

    const [counts, setCounts]=useState<{
        totalExe:number,
        totalXp:number,
    }>()

    useEffect(()=>{
        courseDetail&&GetCounts()
    },[courseDetail])

    const GetCounts=()=>{
        let totalExercises=0;
        let totalXp=0;
        courseDetail?.chapters?.forEach((chapter)=>{
            totalExercises=totalExercises+chapter?.exercises?.length
            chapter?.exercises?.forEach(exc=>{
                totalXp=totalXp+exc?.xp;
            })
        })

        setCounts({
            totalExe:totalExercises,
            totalXp:totalXp,
        })
    }

  return (
    <div className='font-game  p-4 border-4 rounded-2xl '>
        <h2 className='text-3xl'>Course Progress</h2>
        <div className='flex items-center gap-5 mt-4'>
            <Image src={'/book.png'} alt='book' width={50} height={50}/>
            <div className='w-full'>
                <h2 className='flex justify-between text-2xl'>Exercises
                    <span className='text-slate-400'>1/{counts?.totalExe}</span></h2>
                <Progress value={37} className='mt-2'/>
            </div>
        </div>

         <div className='flex items-center gap-5 mt-4'>
            <Image src={'/star.png'} alt='book' width={50} height={50}/>
            <div className='w-full'>
                <h2 className='flex justify-between text-2xl'>XP Earned 
                    <span className='text-slate-400'>1/{counts?.totalXp}</span></h2>
                <Progress value={37} className='mt-2'/>
            </div>
        </div>

    </div>
  )
}

export default CourseStatus