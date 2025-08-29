"use client"
import SubAccountDetails from '@/components/forms/subaccount-details'
import CustomModal from '@/components/global/custom-modal'
import { Button } from "@/components/ui/button"
import { AuthUserDetails } from '@/types'
import { useModal } from "@/providers/modal-provider"
import clsx from 'clsx'
import { PlusCircleIcon } from 'lucide-react'
import React from 'react'
  
type Props = {
    user: AuthUserDetails
    id: string
    className?: string
  }
  
export const CreateButton: React.FC<Props> = ({ id, user, className }) => {
  const { setOpen } = useModal()
  const agencyDetails = user?.Agency
  if (!agencyDetails) return 
  

    return (
      <Button
        className={clsx("w-full flex gap-4", className)}
        onClick={() => setOpen(
          <CustomModal
            title='Create a Subaccount'
            subHeading = 'You can switch between subaccounts'
          >
            <SubAccountDetails agencyDetails={agencyDetails} userId={user.id} userName={user.name} />
          </CustomModal>
        )}
      >
        <PlusCircleIcon size={15} />
       Create Sub Account 
      </Button>
    )
  }