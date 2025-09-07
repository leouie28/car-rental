import { Image, MessageSquareMore, SendHorizonal, X } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import socket from '../socket'
import { useSession } from '../context/SessionContext'
import { useQuery } from '@tanstack/react-query'
import { getMessages } from '../rest/message'
import dayjs from 'dayjs'
import notificationSound from '../assets/bling.mp3'
import MessageAttachemnt from './MessageAttachemnt'
import api from '../lib/api'

export default function ClientMessage() {
  const { user } = useSession()
  const userId = user?.id
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [msgInput, setMsgInput] = useState('');
  const messagesEndRef = useRef(null);
  const audioRef = useRef(new Audio(notificationSound));
  const fileInputRef = useRef(null)
  const [files, setFiles] = useState([])
  const [imgLoading, setImgLoading] = useState(false)

  useEffect(() => {
    // socket.emit("join", userId)

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
    if (!msgInput && !files.length) return
    let msgData = {
      from: userId,
      to: "admin",
      message: msgInput,
      createdAt: new Date,
      attachment: null
    }
    files.length ? msgData.attachment = { imageIds: files.map((d) => d?.id) } : null
    socket.emit("send_message", msgData)
    setMessages((prev) => [msgData, ...prev])
    setMsgInput("")
    setFiles([])
  }

  const handleImageChange = async (e) => {
    const filesData = e.target.files;
    if (!filesData.length) return
    setImgLoading(true);

    const uploadedImages = await Promise.all(
      Array.from(filesData).map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = async () => {
              try {
                const base64 = reader.result;
                const res = await api.post("/upload-image", { base64 });
                resolve(res.data); // return uploaded image data
              } catch (err) {
                reject(err);
              }
            };
            reader.onerror = reject;
          })
      )
    );

    // Update state once with all new images
    setFiles((prev) => prev.length ? [...prev, uploadedImages] : [...uploadedImages])

    setImgLoading(false);
  };

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
              {!d?.from ? (
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
        <div className='flex flex-col bg-base-100 border border-base-content/20 rounded-xl overflow-hidden'>
          {files.length ? (
            <div className='flex gap-2 mt-2 mx-2'>
              {files?.map((img, i) => (
                <div key={i} className='aspect-[5/4] w-14 bg-base-200 rounded overflow-hidden'>
                  <img 
                    className='object-center object-cover'
                    src={img?.base64}
                  />
                </div>
              ))}
            </div>
          ) : null}
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
          <div className='flex justify-end'>
            <input ref={fileInputRef} multiple type="file" className='hidden' onChange={handleImageChange} />
            <button 
              className='btn font-normal text-base-content/80 bg-transparent border-0 hover:opacity-70 hover:text-primary btn-ghost rounded-full'
              onClick={() => fileInputRef?.current?.click()}
            >
              Attach image
              <Image size={16} />
            </button>
            <button 
              disabled={!msgInput && !files.length}
              className='btn bg-transparent border-0 hover:opacity-70 hover:text-primary btn-ghost rounded-full'
              onClick={sendMessage}
            >
              Send
              <SendHorizonal size={16} />
            </button>
          </div>
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
