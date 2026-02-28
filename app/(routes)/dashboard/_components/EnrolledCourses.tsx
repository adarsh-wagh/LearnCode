"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'

function EnrolledCourses() {
    const [enrolledCourses,setEnrolledCources]=useState([]);
  return (
    <div className='mt-8'>

        <h2 className='text-3xl mb-2 font-game'>Your Enrolled Courses:</h2>

        {enrolledCourses?.length==0?
        <div className='flex flex-col items-center gap-3  p-7 border rounded-2xl bg-slate-900'>
            
            <Image src={'/books.png'} alt='books' width={90} height={90} />
            
            <h2 className='font-game text-xl'>You Don't have any enrolled courses</h2>
            
            <Link href={'/courses'}>
            <Button variant={'pixel'} className='font-game text-2xl' size={'lg'}>Browse All Courses</Button>
            </Link>
        </div>

        :<div>
            List
            </div>
        }
    </div>
  )
}

export default EnrolledCourses