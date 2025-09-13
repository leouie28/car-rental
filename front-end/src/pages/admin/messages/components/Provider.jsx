import React, { createContext, useContext, useEffect, useState } from 'react'
import { getMessages } from '../../../../rest/admin/message'
import socket from '../../../../socket'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useRef } from 'react'
import notificationSound from '../../../../assets/bling.mp3'

const MessageContext = createContext()

export function AdminMessageProvider({ children }) {
  const { id: clientId } = useParams()
  const [msgList, setMsgList] = useState([])
  const [conversation, setConversation] = useState([])
  const audioRef = useRef(new Audio(notificationSound));

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-message-list'],
    queryFn: () => getMessages()
  })

  useEffect(() => {
    if (data) {
      setMsgList(data)
    }
  }, [data])

  const updateList = (targetId, msg) => {
    if (msgList.find(x => x?.id == targetId)) {
      setMsgList((prev) => {
        const copy = [...prev]
        const i = copy.findIndex(x => targetId == x?.id)
        copy[i].latest = msg
        return copy
      })
    }else {
      refetch()
    }
  }

  useEffect(() => {
    // socket.emit("join", "admin")

    socket.on("receive_message", (msg) => {
      if (conversation.length) {
        const first = conversation[0]
        if (msg?.from == first?.from || msg?.from == first?.to) {
          setConversation((prev) => [msg, ...prev])
        }
      }
      updateList(msg?.from, msg)
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    })

    return () => socket.off("receive_message")
  }, [conversation])

  const sendMessage = (msgData) => {
    socket.emit("send_message", msgData)
    updateList(msgData?.to, msgData)
    setConversation((prev) => [msgData, ...prev])
  }

  return (
    <MessageContext.Provider value={{ msgList, conversation, setConversation, sendMessage }}>
      {children}
    </MessageContext.Provider>
  )
}

export const useMessage = () => {
  return useContext(MessageContext)
}