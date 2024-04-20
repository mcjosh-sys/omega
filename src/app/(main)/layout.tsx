import { TooltipProvider } from '@/components/ui/tooltip'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const Layout = ({ children }:
    { children: React.ReactNode }
) => {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark
            }}
        >
            <TooltipProvider>

                {children}
            </TooltipProvider>
        </ClerkProvider>
    )
}

export default Layout