import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import React from 'react'

function InviteFriend() {
  return (
    <div className='flex flex-col items-center mt-8 p-4 border rounded-xl bg-slate-900'>
        <Image src={'/mail.png'} alt='mail' width={80} height={80} />
        <h2 className='text-3xl font-game'>Invite Friends</h2>
        <p className='font-game'>Having fun? Share the love with your friends, Enter an Email and they'll get a personal Invitation</p>
    <div className='flex gap-2 items-center mt-5 '>
        <Input placeholder='Enter Invitation email' className='min-w-sm' />
        <Button variant={'pixel'} className='font-game h-8'>Invite</Button>
    </div>
    </div>
  )
}

export default InviteFriend