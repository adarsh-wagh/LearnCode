'use client'

import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import axios from 'axios'

function UserStatus() {

  const { user } = useUser()
  const [xp, setXp] = useState(0)

  useEffect(() => {
    GetXP()
  }, [])

  const GetXP = async () => {
    try {
      const result = await axios.get('/api/course?courseID=enrolled')

      const courses = Array.isArray(result.data) ? result.data : []

      const totalXP = courses.reduce((sum: number, course: any) => {
        return sum + (course.xpEarned || 0)
      }, 0)

      setXp(totalXP)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='p-4 border-4 rounded-2xl w-full'>
      
      <div className='flex gap-3 items-center'>
        <Image
          src={'/alex_walk.gif'}
          alt='walking_gif'
          width={70}
          height={70}
          className="shrink-0"
        />

        <div className="min-w-0">
          <h2 className='font-game text-2xl truncate'>
            {user?.primaryEmailAddress?.emailAddress}
          </h2>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-5 mt-4'>

        <div className='flex gap-3 items-center'>
          <Image src={'/star.png'} alt='star' width={35} height={35}/>
          <div>
            <h2 className='text-3xl font-game'>{xp}</h2>
            <h2 className='font-game text-xl text-slate-500'>Total Rewards</h2>
          </div>
        </div>

        <div className='flex gap-3 items-center'>
          <Image src={'/badge.png'} alt='badge' width={35} height={35}/>
          <div>
            <h2 className='text-3xl font-game'>2</h2>
            <h2 className='font-game text-xl text-slate-500'>Badge</h2>
          </div>
        </div>

        <div className='flex gap-3 items-center'>
          <Image src={'/fire.png'} alt='fire' width={35} height={35}/>
          <div>
            <h2 className='text-3xl font-game'>7</h2>
            <h2 className='font-game text-xl text-slate-500'>Daily Streak</h2>
          </div>
        </div>

      </div>

    </div>
  )
}

export default UserStatus