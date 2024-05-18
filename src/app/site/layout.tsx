import { ClerkProvider, currentUser } from "@clerk/nextjs";
import Navigation from "@/components/site/navigation";

export default async function SiteLayout(
  { children }:
    { children: React.ReactNode }
) {

  const user = await currentUser()

  return (
    
      <main className="h-full">
        <Navigation user={user} />
        {children}
      </main>
  )
}
