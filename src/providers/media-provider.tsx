'use client'
import { getMedia } from "@/lib/queries";
import { SubAccountWithMedia } from "@/types";
import { Media } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";
import { ModalContext } from "./modal-provider";

type Props = {
    subaccountId: string,
    children: React.ReactNode
}

const MediaContext = createContext<{
    data: SubAccountWithMedia,
    fetchData: () => void
}>({
    data: null,
    fetchData: () => {}
})

const MediaProvider = ({ subaccountId, children }: Props) => {
    const [data, setData] = useState<SubAccountWithMedia>(null)

    const fetchData = async () => {
        const res = await getMedia(subaccountId)
        setData(res)
    }

    useEffect(() => {
        const fetchData = async () => {
            const res = await getMedia(subaccountId)
            setData(res)
        }
        fetchData()
    }, [subaccountId])

    return (
        <MediaContext.Provider value={{ data, fetchData }}>
            {children}
        </MediaContext.Provider>
    )
}

export const useMedia = () => {
    return useContext(MediaContext)
}

export default MediaProvider



