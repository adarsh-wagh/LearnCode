'use client'

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'
import Image from 'next/image'

export default function SignInPage() {
  return (
    <div className="!min-h-screen !grid !w-full !items-center !bg-slate-900 !px-4 !font-mono !text-sm !text-white">

      <SignIn.Root>

        <SignIn.Step
          name="start"
          className="!mx-auto !w-full sm:!w-96 !space-y-6 !bg-slate-800 !px-4 !py-8 !border-4 !border-black !shadow-[8px_8px_0_0_#000]"
        >

          <header className="!text-center flex flex-col items-center ">

            <Image src={'/logo.png'} alt='logo' width={50} height={0} className=''/>

            <h1 className="!mt-3 !text-base !font-bold !tracking-wide !text-yellow-400 !uppercase">
              Sign In
            </h1>

          </header>


          <Clerk.GlobalError className="!block !text-sm !text-red-500" />


          {/* GOOGLE LOGIN */}
          <Clerk.Connection
            name="google"
            className="!flex !w-full !items-center !justify-center !gap-3 !px-4 !py-2 !bg-yellow-400 !border-2 !border-black !shadow-[4px_4px_0_0_#000] active:!translate-y-[2px] active:!shadow-none !font-bold"
          >
            <span className="!text-black">
              Login with Google
            </span>
          </Clerk.Connection>


          {/* EMAIL FIELD */}
          <Clerk.Field
            name="identifier"
            className="!space-y-1"
          >

            <Clerk.Label className="!font-bold !text-yellow-400 !uppercase">
              Email
            </Clerk.Label>

            <Clerk.Input
              type="email"
              required
              className="!w-full !px-3 !py-2 !bg-slate-900 !border-2 !border-black !shadow-[3px_3px_0_0_#000] !outline-none focus:!border-yellow-400 !text-white"
            />

            <Clerk.FieldError className="!text-sm !text-red-500" />

          </Clerk.Field>


          {/* PASSWORD FIELD */}
          <Clerk.Field
            name="password"
            className="!space-y-1"
          >

            <Clerk.Label className="!font-bold !text-yellow-400 !uppercase">
              Password
            </Clerk.Label>

            <Clerk.Input
              type="password"
              required
              className="!w-full !px-3 !py-2 !bg-slate-900 !border-2 !border-black !shadow-[3px_3px_0_0_#000] !outline-none focus:!border-yellow-400 !text-white"
            />

            <Clerk.FieldError className="!text-sm !text-red-500" />

          </Clerk.Field>


          {/* SUBMIT BUTTON */}
          <SignIn.Action
            submit
            className="!w-full !px-4 !py-2 !bg-yellow-400 !border-2 !border-black !shadow-[4px_4px_0_0_#000] active:!translate-y-[2px] active:!shadow-none !text-black !font-bold !uppercase"
          >
            Sign In
          </SignIn.Action>


          {/* SIGN UP LINK */}
          <p className="!text-center !text-xs !text-yellow-400">

            No account?{" "}

            <Clerk.Link
              navigate="sign-up"
              className="!font-bold !underline !underline-offset-2 hover:!text-yellow-200"
            >
              Create account
            </Clerk.Link>

          </p>

        </SignIn.Step>

      </SignIn.Root>

    </div>
  )
}