import { SignUp } from '@clerk/nextjs'

const Page = () => {
  return (
    <SignUp afterSignInUrl='/agency' afterSignUpUrl='/agency' />
  )
}

export default Page