import Navigation from "@/components/site/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  return (
    <main className="h-full">
      <Navigation user={user} />
      {children}
    </main>
  );
}
