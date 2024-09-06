import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex">
      <div className="mt-20 md:mt-28 w-full flex flex-col gap-4 items-center justify-center p-4">
        <SignUp />
      </div>
    </div>
  )
}
