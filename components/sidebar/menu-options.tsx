"use client"

import { icons } from '@/lib/constants'
import { useModal } from '@/providers/modal-provider'
import { AuthUserDetails } from '@/types'
import { Agency, AgencySidebarOption, SubAccount, SubAccountSidebarOption } from '@/lib/generated/prisma'
import clsx from 'clsx'
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import SubAccountDetails from '../forms/subaccount-details'
import CustomModal from '../global/custom-modal'
import { AspectRatio } from '../ui/aspect-ratio'
import { Button } from '../ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Separator } from '../ui/separator'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

type Props = {
  defaultOpen?: boolean
  subaccounts: SubAccount[]
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[]
  sidebarLogo: string
  details: Agency | SubAccount
  user: AuthUserDetails
  id: string
}

const MenuOptions: React.FC<Props> = ({
  defaultOpen,
  subaccounts,
  sidebarOpt,
  sidebarLogo,
  details,
  user,
  id
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const { setOpen } = useModal()

  const openState = useMemo(() => {
    return defaultOpen ? { open: true } : {}
  }, [defaultOpen])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return

  return (
    <Sheet
      modal={false}
      {...openState}
    >
      <SheetTrigger asChild className='absolute left-4 top-4 z-[100] flex md:hidden'>
        <Button
          variant="outline"
          size="icon"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        showX={!defaultOpen}
        side='left'
        className={clsx("bg-background/80 backdrop-blur-xl fixed top-0 border-r-[1px] p-6", {
          'hidden md:inline-block z-0 w-[300px]': defaultOpen,
          'inline-block md:hidden z-[100] w-full': !defaultOpen
        })}
      >
        <SheetHeader>
          <VisuallyHidden>
              <SheetTitle>Side Menu</SheetTitle>
          </VisuallyHidden>
        </SheetHeader>
        <div>
          <AspectRatio ratio={16 / 5}>
            <Image
              src={sidebarLogo}
              alt='sidebar logo'
              fill
              className='rounded-md object-contain'
            />
          </AspectRatio>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className='w-full mr-4 flex items-center justify-between py-8 mt-2'
                variant='ghost'
              >
                <div className='flex items-center text-left gap-2'>
                  <Compass />
                  <div className='flex flex-col'>
                    {details.name}
                    <span className='text-muted-foreground'>{details.address}</span>
                  </div>
                </div>
                <div>
                  <ChevronsUpDown size={16} className='text-muted-foreground' />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-80 h-80 mt-4 z-[200]'>
              <Command className='rounded-lg '>
                <CommandInput placeholder='Search accounts...' />
                <CommandList className='pb-16 scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-w-2'>
                  <CommandEmpty>No results found</CommandEmpty>
                  {(['AGENCY_OWNER', 'AGENCY_ADMIN'].includes(user?.role!)) && user?.Agency && (
                    <CommandGroup heading="Agency">
                      <CommandItem className='!bg-transparent my-2 text-primary border-[1px] border-border  p-2 rounded-md hover:!bg-muted cursor-pointer transition-all'>
                        {defaultOpen ? (
                          <Link
                            href={`/agency/${user.Agency.id}`}
                            className='flex gap-4 w-full h-full'
                          >
                            <div className='relative w-16'>
                              <Image
                                src={user.Agency.agencyLogo}
                                alt='Agency Logo'
                                fill
                                className='rounded-md object-contain'
                              />
                            </div>
                            <div className='flex flex-col flex-1'>
                              {user.Agency.name}
                              <span className='text-muted-foreground'>{user.Agency.address}</span>
                            </div>
                          </Link>
                        ) : (
                          <SheetClose asChild>
                            <Link
                              href={`/agency/${user.Agency.id}`}
                              className='flex gap-4 w-full h-full'
                            >
                              <div className='relative w-16'>
                                <Image
                                  src={user.Agency.agencyLogo}
                                  alt='Agency Logo'
                                  fill
                                  className='rounded-md object-contain'
                                />
                              </div>
                              <div className='flex flex-col flex-1'>
                                {user.Agency.name}
                                <span className='text-muted-foreground'>{user.Agency.address}</span>
                              </div>
                            </Link>
                          </SheetClose>
                        )}
                      </CommandItem>
                    </CommandGroup>
                  )}
                  <CommandGroup heading='Accounts'>
                    {!!subaccounts.length ? subaccounts.map((subaccount) => (
                      <CommandItem key={subaccount.id}>
                        {defaultOpen ? (
                          <Link
                            href={`/subaccount/${subaccount.id}`}
                            className='flex gap-4 w-full h-full'
                          >
                            <div className='relative w-16'>
                              <Image
                                src={subaccount.subAccountLogo}
                                alt='Agency Logo'
                                fill
                                className='rounded-md object-contain'
                              />
                            </div>
                            <div className='flex flex-col flex-1'>
                              {subaccount.name}
                              <span className='text-muted-foreground'>{subaccount.address}</span>
                            </div>
                          </Link>
                        ) : (
                          <SheetClose asChild>
                            <Link
                              href={`/subaccount/${subaccount.id}`}
                              className='flex gap-4 w-full h-full'
                            >
                              <div className='relative w-16'>
                                <Image
                                  src={subaccount.subAccountLogo}
                                  alt='Agency Logo'
                                  fill
                                  className='rounded-md object-contain'
                                />
                              </div>
                              <div className='flex flex-col flex-1'>
                                {subaccount.name}
                                <span className='text-muted-foreground'>{subaccount.address}</span>
                              </div>
                            </Link>
                          </SheetClose>
                        )}
                      </CommandItem>
                    )) : (
                      <div className='h-full w-full flex items-center justify-center'>
                        <p className='ml-2'>No accounts.</p>
                      </div>
                    )}
                  </CommandGroup>
                </CommandList>
                {['AGENCY_OWNER', 'AGENCY_ADMIN'].includes(user?.role!) && (
                  <Button
                    className='flex gap-2'
                    onClick={() => setOpen(
                      <CustomModal
                        title='Create A Sub Account'
                        subHeading='You can switch between your agency account and the sub account from the sidebar'
                        defaultOpen={false}
                      >
                        <SubAccountDetails
                          agencyDetails={user?.Agency!}
                          userId={user?.name!}
                          userName={user?.name!}
                        />
                      </CustomModal>
                    )}
                  >
                    <PlusCircleIcon size={15} />
                    Create Sub Account
                  </Button>
                )}
              </Command>
            </PopoverContent>
          </Popover>
          <p className='text-muted-foreground text-xs my-2'>MENU LINKS</p>
          <Separator className='mb-4' />
          <nav className='relative'>
            <Command className='rounded-lg overflow-visible bg-transparent'>
              <CommandInput placeholder='Search...' />
              <CommandList className='py-4 overflow-visible'>
                <CommandEmpty>No results found</CommandEmpty>
                {sidebarOpt.map((option) => {
                  let val;
                  const result = icons.find((icon) => icon.value === option.icon)
                  if (result) {
                    val = <result.path />
                  }
                  return (
                    <CommandItem
                      key={option.id}
                      className='md:w-[320px] w-full'
                    >
                      <SheetClose asChild>
                        <Link
                          href={option.link}
                          className='flex itemss-center gap-2 hover:bg-transparent rounded-md transition-all md:w-[320px] w-full'
                        >
                          {val}
                          <span>{option.name}</span>
                        </Link>
                      </SheetClose>
                    </CommandItem>
                  )
                })}
              </CommandList>
            </Command>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MenuOptions