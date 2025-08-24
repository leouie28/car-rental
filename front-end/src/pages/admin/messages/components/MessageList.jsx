import React from 'react'
import { useMessage } from './Provider'
import { UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

export default function MessageList({ activeId }) {
  const { msgList } = useMessage()
  const navigate = useNavigate()

  return (
    <div className="mt-2 space-y-2">
      {msgList?.sort((a, b) => new Date(b?.latest?.createdAt) - new Date(a?.latest?.createdAt))?.map((d, i) => (
        <div 
          key={i}
          className={`${d?.id == activeId ? 'bg-base-200 pointer-events-none' : ''} flex gap-3 items-center p-2 cursor-pointer rounded-lg hover:bg-base-200`}
          onClick={() => navigate(`/admin/messages/${d?.id}`)}
        >
          <div className="avatar avatar-placeholder">
            <div className="bg-base-content/50 text-neutral-content w-11 rounded-full">
              <UserRound />
            </div>
          </div>
          <div>
            <h3 className="font-medium">{d?.firstName} {d?.lastName}</h3>
            <p className="text-sm line-clamp-1">
              {d?.latest?.from == 1 ? `You: ${d?.latest?.message}` : d?.latest?.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
