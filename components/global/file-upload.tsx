import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from '../ui/button'
import { UploadDropzone } from '@/lib/uploadthing'

type Props = {
    apiEndpoint: 'agencyLogo' | 'avatar' | 'subaccountLogo',
    onChange: (url: string) => void
    value?: string
}

const FileUpload: React.FC<Props> = ({ apiEndpoint, value, onChange }) => {

    const type = value?.split('.').pop()

    if (value) {
        return <div className='flex flex-col justify-center items-center'>
            {type !== 'pdf' ? (
                <div className='relative w-40 h-40'>
                    <Image
                        src={value}
                        fill
                        alt='uploade image'
                        className='object-contain'
                    />
                </div>
            ) : (
                <div className='relative flex items-center p-2 mt-2 rounded-md bg-background'>
                    <FileIcon />
                    <a
                        href={value}
                        target='__blank'
                            rel='noopener noreferrer'
                            className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
                        >
                            View PDF 
                    </a>
                </div>
            )}
            <Button
                onClick={() => onChange('')}
                variant='ghost'
                type='button'
            >
                <X className='h-4 w-4'/>
                Remove Logo
            </Button>
        </div>
    }

    return (
        <div className='w-full bg-muted/30'>
            <UploadDropzone
                endpoint={apiEndpoint}
                onClientUploadComplete={(res) => {
                    // console.log('[file-upload]: ',res)
                    onChange(res?.[0].url)
                }}
                onUploadError={(error: Error) => {
                    console.log('[file-upload]: ', error)
                }}
            />
        </div>
    )
}

export default FileUpload