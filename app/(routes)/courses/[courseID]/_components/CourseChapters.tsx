"use client"
import React, { useEffect } from 'react'
import { Course } from '../../_components/CourseList'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"
import Link from 'next/link'

type Props={
  loading:boolean,
  courseDetail:Course|undefined,
}

function CourseChapters({loading,courseDetail}:Props) {

  useEffect(()=>{
    console.log("courseDetail:",courseDetail)
  },[courseDetail])

  const EnableExercise = (
chapterIndex: number, exerciseIndex: number, length: number  )=>{
    const completed = courseDetail?.completedExercises

    if(!completed || completed.length===0){
      return chapterIndex===0 && exerciseIndex===0
    }

    const last = completed[completed.length-1]

    const currentExerciseNumber =
      courseDetail?.chapters
        ?.slice(0,chapterIndex)
        .reduce((acc,ch)=>acc + ch.exercises.length,0)! +
      exerciseIndex + 1

    const lastCompletedNumber =
      courseDetail?.chapters
        ?.slice(0,last.chapterId-1)
        .reduce((acc,ch)=>acc + ch.exercises.length,0)! +
      last.exerciseId

    return currentExerciseNumber === lastCompletedNumber + 1
  }

  const isExerciseCompleted=(chapterId:number,exerciseId:number)=>{
    const completed = courseDetail?.completedExercises
    const found = completed?.find(
      item=>item.chapterId===chapterId && item.exerciseId===exerciseId
    )
    return !!found
  }

  return (
    <div>

      {courseDetail?.chapters?.length==0 ?

      <div>
        <Skeleton className='w-full h-[10px] rounded-xl'/>
        <Skeleton className='w-full h-[10px] mt-5 rounded-xl'/>
      </div>

      :

      <div className='p-5 border-4 rounded-2xl'>

        {courseDetail?.chapters?.map((chapter,index)=>(
          <Accordion type="single" collapsible key={index}>

            <AccordionItem value="item-1">

              <AccordionTrigger className='p-3 hover:bg-slate-800 font-game text-4xl'>

                <div className='flex gap-10'>
                  <h2 className='h-12 w-12 bg-slate-800 rounded-full flex items-center justify-center'>
                    {index+1}
                  </h2>

                  <h2>{chapter?.name}</h2>
                </div>

              </AccordionTrigger>

              <AccordionContent>

                <div className='p-7 bg-slate-900 rounded-xl font-game'>

                  {chapter?.exercises.map((exc,indexExc)=>(

                    <div key={indexExc} className='flex items-center justify-between mb-7'>

                      <div className='flex items-center gap-10'>

                        <h2 className='text-3xl'>
                          Exercise {
                            courseDetail?.chapters
                              ?.slice(0,index)
                              .reduce((acc,ch)=>acc + ch.exercises.length,0)! +
                            indexExc + 1
                          }
                        </h2>

                        <h2 className='text-3xl'>{exc?.name}</h2>

                      </div>

                      {EnableExercise(index,indexExc, chapter?.exercises?.length) ?

                        <Link href={'/courses/'+courseDetail?.courseID+'/'+chapter?.chapterId+'/'+exc?.slug}>
                          <Button variant={'pixel'} className='text-xl'>
                            {exc?.xp} xp
                          </Button>
                        </Link>

                      :

                      isExerciseCompleted(chapter?.chapterId,indexExc+1) ?

                        <Button variant={'pixel'} className='text-xl bg-green-600'>
                          Completed
                        </Button>

                      :

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant={'pixelDisabled'} className='text-xl'>
                                ???
                              </Button>
                            </TooltipTrigger>

                            <TooltipContent>
                              <p className='font-game text-lg'>
                                Please Enroll First
                              </p>
                            </TooltipContent>

                          </Tooltip>
                        </TooltipProvider>

                      }

                    </div>

                  ))}

                </div>

              </AccordionContent>

            </AccordionItem>

          </Accordion>
        ))}

      </div>

      }

    </div>
  )
}

export default CourseChapters