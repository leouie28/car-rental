import React from 'react'
import Chat from '../../components/chat'
import { SendHorizonal } from 'lucide-react'

export default function BookingPage() {

  return (
    <div>
      <h1>Booking page</h1>
      <div className="card bg-base-200 max-w-xl">
        <div className="card-body">
          <div className="card-title">Chat</div>
          <div>
            <div className="chat chat-start">
              <div className="chat-bubble chat-bubble-warning">What kind of nonsense is this</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble">What kind of nonsense is this</div>
            </div>
          </div>
          <div className="card-actions justify-end">
            <textarea 
              className='textarea w-full'
              placeholder='Write message...'
            ></textarea>
            <button className='btn'>
              Send
              <SendHorizonal size={16} className='text-base-content/80' />
            </button>
          </div>
        </div>
      </div>
      <Chat />
    </div>
  )
}
