import React from 'react'
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


type Props={
    loading:boolean,
    courseDetail:Course|undefined,
}


function CourseChapters({loading,courseDetail}:Props) {
  return (
    <div>
      {courseDetail?.chapters?.length==0?
    <div>
      <Skeleton className='w-full h-[10px] rounded-xl'/>
      <Skeleton className='w-full h-[10px] mt-5 rounded-xl'/>
      </div>  
    :
      <div  className='p-5 border-4 rounded-2xl'>
          {courseDetail?.chapters?.map((chapter,index)=>(
            <Accordion type="single" collapsible key={index}>
                <AccordionItem value="item-1">
                  <AccordionTrigger className='p-3 hover:bg-slate-800 font-game text-4xl'>
                    <div className='flex gap-10'>
                      <h2 className='h-12 w-12 bg-slate-800 rounded-full 
                      flex items-center justify-center'>{index+1}</h2>
                      <h2>{chapter?.name}</h2>
                    </div>
                    </AccordionTrigger>
                    <AccordionContent>
                       <div className='p-7 bg-slate-900 rounded-xl font-game '>
                        {chapter?.exercises.map((exc ,indexExc)=>(
                          <div  key={indexExc} className='flex items-center justify-between mb-7'>
                            <div className='flex items-center gap-10'>
                            <h2 className='text-3xl'>Exercise {index* chapter?.exercises?.length+indexExc+1}</h2>
                            <h2 className='text-3xl'>{exc.name}</h2>
                            </div>
                            {/* <Button variant={'pixel'} className='text-xl'>{exc?.xp} xp</Button> */}
                            <Tooltip>
                              <TooltipTrigger asChild> 
                                <Button variant={'pixelDisabled'} className='text-xl'>???</Button></TooltipTrigger>
                              <TooltipContent>
                                <p className='font-game text-lg'>Please Enroll First</p>
                              </TooltipContent>
                            </Tooltip>
                            </div>
                        ))}
                       </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
          ))}
      </div>}
    </div>
  )
}

export default CourseChapters