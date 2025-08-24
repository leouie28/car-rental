import { useMutation } from '@tanstack/react-query'
import { FileQuestionMark, SendHorizonal } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { manualSendMessage } from '../rest/message'

export default function CarDetails({ user, car, setCar }) {
  const [msgInpu, setMsgInput] = useState("Im interested inquiring this car.")
  
  useEffect(() => {
    if (car) {
      const dialog = document.getElementById("inquire_dialog")
      dialog?.showModal()
    }
  }, [car])

  const { mutate, isPending } = useMutation({
    mutationFn: manualSendMessage,
    onSuccess: (res) => {
      setTimeout(() => {
        window.location.reload()
      })
    }
  })

  if (!car) return <></>

  return (
    <dialog id="inquire_dialog" className="modal" onClose={() => setCar()}>
      <div className="modal-box max-w-md w-full space-y-6">
        {car?.images.length ? (
          <figure className="aspect-video w-full rounded-lg overflow-hidden">
            <img
              className="group-hover:scale-102 transition-transform w-full h-full object-cover object-center"
              src={car.images[0].base64}
              alt="Car image"
            />
          </figure>
        ) : (
          <div className="aspect-video w-full flex items-center justify-center bg-base-200 rounded-lg">
            <FileQuestionMark className="group-hover:scale-102 transition-transform text-base-content/60" size={42} />
          </div>
        ) }
        <div className="collapse collapse-arrow bg-base-200">
          <input type="checkbox" defaultChecked />
          <div className="collapse-title font-semibold">
            {car?.make} - {car?.model} {car?.year} ({car?.color})
          </div>
          <div className='collapse-content space-y-3 text-base-content/80'>
            <div className='flex justify-between items-center'>
              Transmission
              <span className='capitalize font-medium'>{car?.transmission}</span>
            </div>
            <div className='flex justify-between items-center'>
              Fuel
              <span className='capitalize font-medium'>{car?.fuelType}</span>
            </div>
            <div className='flex justify-between items-center'>
              Seats
              <span className='capitalize font-medium'>{car?.seatCount}</span>
            </div>
            <div className='flex justify-between items-center'>
              Doors
              <span className='capitalize font-medium'>{car?.doorCount}</span>
            </div>
            <div className="divider"></div>
            <div className='flex justify-between items-center'>
              Security Deposit
              <span className='capitalize font-medium'>₱{car?.securityDeposit ? car?.securityDeposit.toLocaleString('en-US') : '0'}</span>
            </div>
            <div className='flex justify-between items-center'>
              Selft Drive Rate
              <span className='capitalize font-medium'>₱{car?.dailyPrice.toLocaleString('en-US')}</span>
            </div>
            <div className='flex justify-between items-center'>
              With Driver Rate
              <span className='capitalize font-medium'>₱{car?.withDriverDailyPrice ? car?.withDriverDailyPrice.toLocaleString('en-US') : '0'}</span>
            </div>
          </div>
        </div>
        <div className="collapse collapse-arrow bg-base-200">
          <input type="checkbox" />
          <div className="collapse-title font-semibold">Optional message</div>
          <div className="collapse-content">
            <textarea
              className='textarea w-full'
              placeholder='Write additional message...'
              value={msgInpu}
              onChange={(e) => setMsgInput(e.target.value)}
            ></textarea>
          </div>
        </div>
        {user && !user?.isAdmin && (
          <button 
            className="btn btn-primary btn-block"
            disabled={isPending}
            onClick={() => mutate({ message: msgInpu, carId: car.id })}
          >
            Send inquiry to admin
            <SendHorizonal size={18} />
          </button>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
