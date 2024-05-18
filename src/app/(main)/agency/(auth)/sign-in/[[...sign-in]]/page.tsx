import { SignIn } from '@clerk/nextjs'

const Page = () => {
  return (
    <SignIn afterSignInUrl='/agency' afterSignUpUrl='/agency' />
  )
}

export default Page