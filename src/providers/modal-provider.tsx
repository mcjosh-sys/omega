'use client'
import React, { useContext } from "react"
import { Agency, Contact, Plan, User } from "@prisma/client"
import { createContext, useEffect, useState } from "react"
import { PricesList, TicketDetails } from "@/types"
import { useRouter } from "next/navigation"

interface ModalProviderProps {
    children: React.ReactNode
}

export type ModalData = {
    user?: User
    agency?: Agency
    ticket?: TicketDetails[number]
    contact?: Contact
    plans?: {
        defaultPriceId: Plan | ""
        plans: PricesList['data']
    }
}


type ModalContextType = {
    data: ModalData
    isOpen: boolean
    setOpen: (modal: React.ReactNode, fetchData?: () => Promise<ModalData>) => void
    setClose: () => void
}

export const ModalContext = createContext<ModalContextType>({
    data: {},
    isOpen: false,
    setOpen: (modal: React.ReactNode) => { },
    setClose: () => { }
})

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [data, setData] = useState<ModalData>({})
    const [showingModal, setShowingModal] = useState<React.ReactNode>(null)
    const [isMounted, setIsMounted] = useState(false)

    const router = useRouter()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted)
        return null

    const setOpen = async (modal: React.ReactNode, fetchData?: () => Promise<ModalData>) => {
        if (modal) {
            if (fetchData) {
                setData({ ...data, ...await fetchData() } || {})
            }
        }
        setShowingModal(modal)
        setIsOpen(true)
    }


    const setClose = () => {
        setIsOpen(false)
        setData({})
        router.refresh()
    }

    return <ModalContext.Provider value={{ data, setOpen, setClose, isOpen }}>
        {children}
        {showingModal}
    </ModalContext.Provider>
}

export const useModal = () => {
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error('useModal must be used within the modal provider')
    }
    return context
}

export default ModalProvider