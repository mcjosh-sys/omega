import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { getAuthUserDetails } from '@/lib/queries'
import { DeleteButton } from './_components/delete-button'
import { CreateButton } from './_components/create-button'

type Props = {
  params: {
    agencyId: string
  }
}

const SubAccountsPage = async ({ params: { agencyId } }: Props) => {

  const user = await getAuthUserDetails()
  if (!user) return


  return (
    <AlertDialog>
      <div className='flex flex-col h-full'>
        <CreateButton
          user={user}
          id={agencyId}
          className='w-[200px] self-end my-6'
        />
        <Command className='rounded-lg bg-transparent'>
          <CommandInput />
          <CommandList className='h-full !max-h-[600px]'>
            <CommandEmpty>No results found</CommandEmpty>
            <CommandGroup heading="Sub Accounts">
              {!!user.Agency?.SubAccount.length ? user.Agency.SubAccount.map((subaccount) => (
                <CommandItem
                  key={subaccount.id}
                  className="h-32 !bg-background my-2 text-primary border-[1px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all"
                >
                  <Link
                    href={`/subaccount/${subaccount.id}`}
                    className='flex gap-4 w-full h-full text-white'
                  >
                    <div className='relative w-32'>
                      <Image
                        src={subaccount.subAccountLogo}
                        alt='subaccount logo'
                        fill
                        className='rounded-md object-contain bg-muted/50 p-4'
                      />
                    </div>
                    <div className='flex flex-col justify-between'>
                      <div className='flex flex-col'>
                        {subaccount.name}
                        <span className='text-muted-foreground text-xs'>{subaccount.address}</span>
                      </div>
                    </div>
                  </Link>
                  <AlertDialogTrigger asChild>
                    <Button
                      size='sm'
                      variant='destructive'
                      className='w-20 hover:bg-red-600 hover:text-white transition-colors duration-500'
                    >
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you abosutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className='text-left'>
                        This action cannot be undone. This will permanently delete the subaccount and all data related to the subaccount.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='flex items-center'>
                      <AlertDialogCancel className='mb-2'>Cancel</AlertDialogCancel>
                      <AlertDialogAction className='bg-destructive hover:bg-destructive'>
                        <DeleteButton subaccountId={subaccount.id} />
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </CommandItem>
              )) : (
                <div className='text-muted-foreground text-center p-4'>
                  No sub accounts
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </AlertDialog>
  )
}

export default SubAccountsPage