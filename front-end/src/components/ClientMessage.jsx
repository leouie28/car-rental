import { MessageSquareMore, SendHorizonal, X } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import socket from '../socket'
import { useSession } from '../context/SessionContext'
import { useQuery } from '@tanstack/react-query'
import { getMessages } from '../rest/message'
import dayjs from 'dayjs'
import notificationSound from '../assets/bling.mp3'
import MessageAttachemnt from './MessageAttachemnt'

export default function ClientMessage() {
  const { user } = useSession()
  const userId = user?.id
  const adminId = 1
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [msgInput, setMsgInput] = useState('');
  const messagesEndRef = useRef(null);
  const audioRef = useRef(new Audio(notificationSound));

  useEffect(() => {
    socket.emit("join", userId)

    socket.on('receive_message', (msg) => {
      setMessages((prev) => [msg, ...prev]);
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    });

    return () => socket.off("receive_message");
  }, [userId]);

  const { data, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: () => getMessages(),
    enabled: !!userId
  })

  useEffect(() => {
    if (data?.length) setMessages(data)
  }, [data])

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages, open]);

  const sendMessage = () => {
    if (!msgInput) return
    const msgData = {
      from: userId,
      to: adminId,
      message: msgInput,
      createdAt: new Date
    }
    socket.emit("send_message", msgData)
    setMessages((prev) => [msgData, ...prev])
    setMsgInput("")
  }

  if (open) {
    return (
      <div className='fixed flex flex-col bottom-0 right-0 z-5 bg-base-100 p-4 shadow border border-base-content/20 rounded-t-xl w-sm h-[70vh]'>
        <div className='flex justify-between items-center pb-2'>
          <h2>Message</h2>
          <button onClick={() => setOpen(false)} className='btn btn-circle btn-sm btn-ghost'>
            <X size={18} />
          </button>
        </div>
        <div className='flex-1 pb-4 flex flex-col-reverse gap-2 justify-start overflow-y-auto'>
          {messages.map((d, i) => (
            <React.Fragment key={`${d?.id}-${i}`}>
              {d?.from === adminId ? (
                <div className="chat chat-start">
                  <div className="chat-header">
                    {d?.attachment ? 'Send by System' : 'Admin'}
                    <time className="text-xs opacity-50">{dayjs(d?.createdAt).format('YYYY MMM DD h:mm a')}</time>
                  </div>
                  <div className="chat-bubble max-w-md chat-bubble-primary">
                    {d?.attachment && <MessageAttachemnt attachment={d.attachment} />}
                    {d?.message}
                  </div>
                </div>
              ) : (
                <div className="chat chat-end">
                  <div className="chat-header">
                    {/* You */}
                    <time className="text-xs opacity-50">{dayjs(d?.createdAt).format('YYYY MMM DD h:mm a')}</time>
                  </div>
                  <div className="chat-bubble max-w-md">
                    {d?.attachment && <MessageAttachemnt attachment={d.attachment} />}
                    {d?.message}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className='flex flex-col items-end bg-base-100 border border-base-content/20 rounded-xl overflow-hidden'>
          <textarea
            className='textarea textarea-ghost resize-none w-full focus-within:outline-transparent'
            placeholder='Write message...'
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            onKeyDown={(e) => {
              if(e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
          ></textarea>
          <button 
            disabled={!msgInput}
            className='btn bg-transparent border-0 hover:opacity-70 hover:text-primary btn-ghost rounded-full'
            onClick={sendMessage}
          >
            Send
            <SendHorizonal size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <button onClick={() => setOpen(true)} className='fixed btn bottom-0 right-0 z-5'>
      <MessageSquareMore size={18} />
      Message
    </button>
  )
}
