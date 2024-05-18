import { ClerkProvider, currentUser } from "@clerk/nextjs";
import { dark } from '@clerk/themes'
import Navigation from "@/components/site/navigation";

export default async function SiteLayout(
  { children }:
    { children: React.ReactNode }
) {

  const user = await currentUser()

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark
      }}
    >
      <main className="h-full">
        <Navigation user={user} />
        {children}
      </main>
    </ClerkProvider>
  )
}
