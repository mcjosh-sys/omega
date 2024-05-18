import { TooltipProvider } from '@/components/ui/tooltip'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const Layout = ({ children }:
    { children: React.ReactNode }
) => {
    return (
        <>
            <TooltipProvider>
                {children}
            </TooltipProvider>
        </>
    )
}

export default Layout