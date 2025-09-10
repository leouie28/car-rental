import { Image, SendHorizonal, UserRound } from 'lucide-react'
import React, { useEffect, useState, useRef } from 'react'
import socket from '../../../socket';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMessageById } from '../../../rest/admin/message';
import dayjs from 'dayjs';
import { useMessage } from './components/Provider';
import MessageAttachemnt from '../../../components/MessageAttachemnt';

export default function AdminMessagesSelected() {
  const { id: clientId } = useParams()
  const [msgInput, setMsgInput] = useState("")
  const messagesEndRef = useRef(null);

  const { conversation, setConversation, sendMessage } = useMessage()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-message', clientId],
    queryFn: () => getMessageById(clientId),
    enabled: !!clientId
  })

  useEffect(() => {
    if (data?.messages) {
      setConversation(data?.messages)
    }
  }, [data])

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]);

  return (
    <div className='p-4 flex flex-col h-full'>
      <div>
        <div className="flex gap-3 items-center p-2 cursor-pointer rounded-lg hover:bg-base-200">
          <div className="avatar avatar-placeholder">
            <div className="bg-base-content/50 text-neutral-content w-11 rounded-full">
              <UserRound />
            </div>
          </div>
          <div>
            <h3 className="font-medium">{data?.client?.firstName} {data?.client?.lastName}</h3>
            <p className="text-sm text-base-content/70">{data?.client?.email}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 gap-2 flex flex-col-reverse pb-4 h-full overflow-y-auto">
        {conversation.map((d, i) => (
          <React.Fragment key={`${d?.id}-${i}`}>
            {d?.from && d?.from != "admin" ? (
              <div className="chat chat-start">
                <div className="chat-header">
                  {data?.client?.firstName} {data?.client?.lastName} {d?.from}
                  <time className="text-xs opacity-50">{dayjs(d?.createdAt).format('YYYY MMM DD h:mm a')}</time>
                </div>
                <div className="chat-bubble whitespace-pre-line max-w-md chat-bubble-primary">
                  {d?.attachment && <MessageAttachemnt attachment={d.attachment} />}
                  {d?.message}
                </div>
              </div>
            ) : (
              <div className="chat chat-end">
                <div className="chat-header">
                  {/* You */}
                  {d?.attachment && 'Send by System'}
                  <time className="text-xs opacity-50">{dayjs(d?.createdAt).format('YYYY MMM DD h:mm a')}</time>
                </div>
                <div className="chat-bubble whitespace-pre-line max-w-md">
                  {d?.attachment && <MessageAttachemnt attachment={d.attachment} />}
                  {d?.message}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div>
        <textarea
          className="textarea w-full"
          value={msgInput}
          onChange={(e) => setMsgInput(e.target.value)}
          placeholder='Write your message here...'
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              sendMessage({
                from: "admin",
                to: clientId,
                message: msgInput,
                createdAt: new Date
              })
              setMsgInput("")
            }
          }}
        ></textarea>
        <div className="flex justify-end gap-2 mt-2">
          {/* <button 
            className="btn btn-ghost"
            onClick={() => {
              sendMessage({
                from: "admin",
                to: clientId,
                message: msgInput,
                createdAt: new Date
              })
              setMsgInput("")
            }}
          >
            Attach image
            <Image size={16} />
          </button> */}
          <button 
            className="btn"
            disabled={!msgInput}
            onClick={() => {
              sendMessage({
                from: "admin",
                to: clientId,
                message: msgInput,
                createdAt: new Date
              })
              setMsgInput("")
            }}
          >
            Send
            <SendHorizonal size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
