import { Button } from '@/components/ui/button'
import React from 'react'

function CommunityHelpSection() {
  return (
    <div className='font-game clear-both p-4 border-4 rounded-xl mt-7 flex items-center flex-col gap-4'>
        <h2 className='text-3xl'>Need Help?</h2>
        <p className='text-2xl'>Ask questions in our community</p>
        <Button variant={'pixel'} size={'lg'} className='text-2xl'>Go To Community</Button>
    </div>
  )
}

export default CommunityHelpSection