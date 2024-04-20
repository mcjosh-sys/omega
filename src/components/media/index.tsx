'use client'
import React from 'react'
import { SubAccountWithMedia } from '@/types'
import { MediaUploadButton } from './upload-button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { FolderSearch } from 'lucide-react'
import MediaCard from './media-card'
import { useMedia } from '@/providers/media-provider'

type Props = {
    subaccountId: string
    data: SubAccountWithMedia
}

const MediaComponent: React.FC<Props> = ({ subaccountId, data }) => {
  return (
      <div className='flex flex-col gap-4 h-fu;; w-full'>
          <div className='flex justify-between items-center'>
              <h1 className='text-4xl'>Media Bucket</h1>
              <MediaUploadButton subaccountId={subaccountId} />
          </div>
          <Command className='bg-transparent'>
              <CommandInput placeholder='Search file name...' />
              <CommandList className='pb-40 !max-h-full'>
                  <CommandEmpty>No media files</CommandEmpty>
                  <CommandGroup heading="Media Files">
                      <div className="flex flex-wrap gap-4 pt-4">
                          {data?.Media.map((file) => (
                              <CommandItem
                                  key={file.id}
                                  className="p-0 max-w-[300px] w-full rounded-lg !bg-transparent !font-medium !text-white"
                              >
                                  <MediaCard file={file} />
                              </CommandItem>
                          ))}
                          {!data?.Media.length && (
                              <div className="flex items-center justify-center w-full flex-col">
                                  <FolderSearch
                                      size={200}
                                      className="dark:text-muted text-slate-300"
                                  />
                                  <p className="text-muted-foreground ">
                                      Empty! no files to show.
                                  </p>
                              </div>
                          )}
                      </div>
                  </CommandGroup>
              </CommandList>
          </Command>
    </div>
  )
}

export default MediaComponent