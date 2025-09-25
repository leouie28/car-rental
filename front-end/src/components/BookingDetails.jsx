import React, { useEffect } from 'react'
import { FileQuestionMark, SendHorizonal } from 'lucide-react'
import dayjs from 'dayjs'

export default function BookingDetails({ b, onClose }) {

  useEffect(() => {
    if (b) {
      document?.getElementById("booking_details_dialog")?.showModal()
    }
  }, [b])

  if (!b) {
    return <div></div>
  }

  return (
    <dialog 
      id="booking_details_dialog" 
      className="modal" 
      onClose={onClose}
    >
      <div className="modal-box w-full max-w-3xl">
        <div className='flex gap-4'>
          {b?.car?.images.length ? (
            <figure className="aspect-[5/4] w-1/4 rounded overflow-hidden">
              <img
                className="group-hover:scale-102 transition-transform w-full h-full object-cover object-center"
                src={b.car.images[0].base64}
                alt="Car image"
              />
            </figure>
          ) : (
            <div className="aspect-square w-18 flex items-center justify-center bg-base-200">
              <FileQuestionMark className="group-hover:scale-102 transition-transform text-base-content/60" size={42} />
            </div>
          ) }
          <div className='space-y-2'>
            <h3 className='font-medium text-lg'>{b.car?.make} - {b.car?.model} {b.car?.year} ({b.car?.color})</h3>
            <p className='text-sm'>{dayjs(b?.dateStart).format('MMM DD YYYY')} - {dayjs(b?.dateReturn).format('MMM DD YYYY')}</p>
            <div className="badge badge-soft capitalize">{b?.status}</div>
          </div>
        </div>
        <div className="divider"></div>
        <ul className='space-y-2 capitalize'>
          <li>Service Type: <div className="badge badge-soft">{b?.withDriver ? 'With Driver' : 'Selft Drive'}</div></li>
          {b?.withDriver && (
            <>
              <li>Driver:</li>
              <li>Pickup Location: {b?.pickupLocation}</li>
              <li>Destination: {b?.destination}</li>
            </>
          )}
          <li>Payment: {b?.paymentOption}</li>
          <li>Security Deposit: {b?.car?.securityDeposit || "N/A"}</li>
          <li>Total Days: {b?.daysBooked || "N/A"}</li>
          <li>Total Payment: {b?.totalPrice}</li>
          <li>Client Note: {b?.note}</li>
        </ul>
        <div className="divider"></div>
        <ul className='space-y-2 capitalize'>
          <li>Client Name: {b?.user?.firstName} {b?.user?.lastName}</li>
          <li>Client Phone Number: {b?.user?.phone}</li>
          <li>Client Email: <span className='lowercase'>{b?.user?.email}</span></li>
        </ul>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
