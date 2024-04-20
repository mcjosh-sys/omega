"use client"
import React, { useState } from 'react'
import { UserButton } from '@clerk/nextjs'
import { Role } from '@prisma/client'
import { Bell } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import moment from 'moment'

import { NotificationWithUser } from '@/types'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Card } from '../ui/card'
import { Switch } from '../ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ModeToggle } from './mode-toggle'

type Props = {
    notifications: NotificationWithUser | []
    role?: Role
    className?: string
    subaccountId?: string
}

const Infobar: React.FC<Props> = ({ notifications, role, className, subaccountId }) => {

    const [allNotifications, setAllNotifications] = useState<NotificationWithUser | []>(notifications)
    const [showAll, setShowAll] = useState(true)

    const handleCheckChange = () => {
        if (!showAll) {
            setAllNotifications(notifications)
        } else {
            if (notifications?.length) {
                setAllNotifications(
                    notifications.filter((item) => item?.subAccountId === subaccountId) ?? []
                )
            }
        }
        setShowAll((prev) => !prev)
    }

    return (
        <>
            <div className={twMerge(
                'fixed z-[20] md:left-[300px] left-0 right-0 top-0 p-4 bg-background/80 backdrop-blur-md flex  gap-4 items-center border-b-[1px]',
                className
            )}>
                <div className='flex items-center gap-2 ml-auto'>
                    <div className='rounded-full border border-border/90 h-9 w-9 object-contain'>
                        <UserButton afterSignOutUrl='/' />
                    </div>
                    <Sheet>
                        <SheetTrigger>
                            <div className='relative rounded-full w-9 h-9 bg-primary flex items-center justify-center text-white'>
                                <Bell size={17} />
                                <div className='absolute -top-1 left-4 bg-red-700 rounded-full h-4 w-5 flex items-center justify-center'>
                                    <span className='px-0.5 text-[0.6rem]'>99+</span>
                                </div>
                            </div>
                        </SheetTrigger>
                        <SheetContent className='mt-4 mr-4 pr-4 flex flex-col'>
                            <SheetHeader className='text-left'>
                                <SheetTitle>Notifications</SheetTitle>
                                <SheetDescription>
                                    {!allNotifications?.length ? (
                                        <div className='flex justify-center text-muted-foreground mb-4'>
                                            You have no notifications
                                        </div>
                                    ) : (role === 'AGENCY_OWNER' || role === 'AGENCY_ADMIN') && (
                                        <Card className='flex items-center justify-between p-4'>
                                            Current Subaccount
                                            <Switch onCheckedChange={handleCheckChange} />
                                        </Card>
                                    )}
                                    {/* {(role === 'AGENCY_OWNER' || role === 'AGENCY_ADMIN') && (
                                        <Card className='flex items-center justify-between p-4'>
                                            Current Subaccount
                                            <Switch onCheckedChange={handleCheckChange} />
                                        </Card>
                                    )} */}
                                </SheetDescription>
                            </SheetHeader>
                            <div className='overflow-y-auto scrollbar-w-2 scrollbar-track-blue-lighter scrollbar-thumb-blue scrollbar-thumb-rounded divide-y'>
                                {allNotifications?.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className='flex flex-col gap-y-2 py-4 overflow-x-auto text-ellipsis hover:bg-primary pl-4'
                                    >
                                        <div className='flex gap-2'>
                                            <Avatar>
                                                <AvatarImage
                                                    src={notification.User.avatarUrl}
                                                />
                                                <AvatarFallback className='bg-primary'>
                                                    {notification.User.name.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className='flex flex-col'>
                                                <p>
                                                    <span className='font-bold'>
                                                        {notification.notification.split("|")[0]}
                                                    </span>
                                                    <span className='text-muted-foreground'>
                                                        {notification.notification.split("|")[1]}
                                                    </span>
                                                    <span className='font-bold'>
                                                        {notification.notification.split("|")[2]}
                                                    </span>
                                                </p>
                                                <small className='text-xs text-muted-foreground'>
                                                    {moment(new Date(notification.createdAt)).format('lll')}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* {!allNotifications?.length && (
                                <div className='flex justify-center text-muted-foreground mb-4'>
                                    You have no notifications
                                </div>
                            )} */}
                        </SheetContent>
                    </Sheet>
                    <ModeToggle />
                </div>
            </div>
        </>
    )
}

export default Infobar