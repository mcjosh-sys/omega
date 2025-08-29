import { ModeToggle } from "@/components/global/mode-toggle"
import { UserButton } from "@clerk/nextjs"
import {type User } from "@clerk/nextjs/server"
import Image from "next/image"
import Link from "next/link"

interface NavigationProps {
    user?: null | User
}

const Navigation: React.FC<NavigationProps> = ({ user }) => {
    return (
        <div className="p-4 flex items-center justify-between relative">
            <aside className="flex items-center gap-2">
                <Image
                    src="/assets/plura-logo.svg"
                    width={40}
                    height={40}
                    alt="omega logo"
                />
                <span className="text-xl font-bold">
                    Omega.
                </span>
            </aside>
            <nav className="hidden md:block absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]">
                <ul className="flex items-center justify-center gap-8">
                    <li className="flex items-center">
                        <Link href="#">Pricing</Link>
                    </li>
                    <li>
                        <Link href="#">About</Link>
                    </li>
                    <li>
                        <Link href="#">Documentation</Link>
                    </li>
                    <li>
                        <Link href="#">Features</Link>
                    </li>
                </ul>
            </nav>
            <aside className="flex gap-2 items-center">
                {user ?
                    <UserButton />
                    :
                    <Link
                        href='/agency'
                        className="bg-primary text-white p-2 px-4 rounded-md hover:bg-primary/80 transition-colors duration-500"
                    >
                        Login
                    </Link>
                }
                <ModeToggle />
            </aside>
        </div>
    )
}

export default Navigation