import React from 'react'
import { TypeIcon } from 'lucide-react'

type Props = {}

const TextPlaceholder = (props: Props) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('componentType', 'text')
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className=" h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
    >
      <TypeIcon
        size={40}
        className="text-muted-foreground"
      />
    </div>
  )
}

export default TextPlaceholder
