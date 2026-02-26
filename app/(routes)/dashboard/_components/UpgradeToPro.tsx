import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function UpgradeToPro() {
  return (
    <div className='flex items-center flex-col p-5 border-4 rounded-2xl mt-8'>
        <Image src={'/logo.png'} alt='logo' width={70} height={70}/>
        <h2 className='text-3xl font-game'>Upgrade to pro</h2>
        <p className='font-game text-slate-400 text-xl'>Join Pro membership and gain access to every Courses</p>
        <Link href={'/pricing'}>
        <Button variant={'pixel'} className='font-game w-full' size={'lg'}>Upgrade</Button>
        </Link>
    </div>
  )
}

export default UpgradeToPro