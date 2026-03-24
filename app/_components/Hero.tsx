'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useUser } from '@clerk/nextjs'

function Hero() {

  const { isSignedIn } = useUser()

  return (
    <div className='w-full relative h-screen overflow-hidden'>
      <Image
        src={'/hero6.png'}
        alt='hero'
        width={1000}
        height={1000}
        className='w-full h-full object-cover absolute inset-0'
      />

      <div className='absolute w-full flex flex-col items-center justify-center top-1/2 -translate-y-1/2'>
        <h2
          className='font-bold text-7xl font-game'
          style={{ textShadow: "2px 2px 0 #000, -2px -2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000" }}
        >
          Start Your
        </h2>

        <h2
          className='font-bold text-8xl font-game text-yellow-400'
          style={{ textShadow: "2px 2px 0 #000, -2px -2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000" }}
        >
          Coding Adventure
        </h2>

        <h2
          className='mt-5 font-game text-3xl'
          style={{ textShadow: "2px 2px 0 #000, -2px -2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000" }}
        >
          Beginner friendly coding courses and projects
        </h2>

        <Link href={isSignedIn ? '/courses' : '/sign-in'}>
          <Button className='font-game text-3xl p-7 mt-5' variant={'pixel'}>
            GET STARTED
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Hero