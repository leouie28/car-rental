import { MessageSquareMore, SendHorizonal, X } from 'lucide-react'
import React, { useState } from 'react'

export default function ClientMessage() {
  const [open, setOpen] = useState(true)

  if (open) {
    return (
      <div className='fixed bottom-0 right-0 z-11 bg-base-100 p-4 shadow border border-base-content/20 rounded-t-xl w-sm h-[70vh]'>
        <div className='flex justify-between items-center'>
          <h2>Chats</h2>
          <button className='btn btn-circle btn-sm btn-ghost'>
            <X size={18} />
          </button>
        </div>
        <div className='h-full bg-base-200'>
          <div className='flex flex-col items-end bg-base-100'>
            <textarea
              className='textarea resize-none w-full'
              placeholder='Write message...'
            ></textarea>
            <button className='flex gap-2 items-center px-3 py-2 text-sm cursor-pointer hover:opacity-60'>
              Send
              <SendHorizonal size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button onClick={() => setOpen(true)} className='fixed btn bottom-0 right-0 z-11'>
      <MessageSquareMore size={18} />
      Chat
    </button>
  )
}
