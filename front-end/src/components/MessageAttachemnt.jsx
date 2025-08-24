import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { carDetails } from '../rest/car'
import { FileQuestionMark } from 'lucide-react'
import { bookingDetails } from '../rest/booking'
import dayjs from 'dayjs'

export default function MessageAttachemnt({ attachment }) {
  const { data: car } = useQuery({
    queryKey: ['car', attachment?.carId],
    queryFn: () => carDetails(attachment?.carId),
    enabled: !!attachment?.carId
  })

  const { data: booking } = useQuery({
    queryKey: ['booking', attachment?.bookingId],
    queryFn: () => bookingDetails(attachment?.bookingId),
    enabled: !!attachment?.bookingId
  })
  
  if (attachment?.carId) {
    if (!car) return <></>
    return (
      <div className='bg-base-100 rounded-md overflow-hidden my-3'>
        {car?.images.length ? (
          <figure className="aspect-video w-full">
            <img
              className="group-hover:scale-102 transition-transform w-full h-full object-cover object-center"
              src={car.images[0].base64}
              alt="Car image"
            />
          </figure>
        ) : (
          <div className="aspect-video w-full flex items-center justify-center bg-base-200">
            <FileQuestionMark className="group-hover:scale-102 transition-transform text-base-content/60" size={42} />
          </div>
        ) }
        <div className='p-2 text-base-content/90'>
          <h3 className='font-medium'>{car?.make} - {car?.model} {car?.year} ({car?.color})</h3>
        </div>
      </div>
    )
  }

  if (attachment?.bookingId) {
    if (!booking) return <></>
    return (
      <div className='bg-base-100 rounded-md overflow-hidden my-3 text-base-content/90 p-2'>
        <div className='flex gap-2 items-center mb-2'>
          {booking.car?.images.length ? (
            <figure className="aspect-[5/4] w-18 rounded overflow-hidden">
              <img
                className="group-hover:scale-102 transition-transform w-full h-full object-cover object-center"
                src={booking.car.images[0].base64}
                alt="Car image"
              />
            </figure>
          ) : (
            <div className="aspect-square w-18 flex items-center justify-center bg-base-200">
              <FileQuestionMark className="group-hover:scale-102 transition-transform text-base-content/60" size={42} />
            </div>
          ) }
          <h3 className='font-medium'>{booking.car?.make} - {booking.car?.model} {booking.car?.year} ({booking.car?.color})</h3>
        </div>
        <div className='text-sm'>
          Date Pickup: 
          <span className='capitalize font-medium ml-2'>{dayjs(booking.dateStart).format('MMM DD YYYY')}</span>
        </div>
        <div className='text-sm'>
          Date Return
          <span className='capitalize font-medium ml-2'>{dayjs(booking.dateReturn).format('MMM DD YYYY')}</span>
        </div>
        <div className='text-sm'>
          Status
          <span 
            className={`ml-2 badge badge-sm uppercase ${booking.status == 'confirmed' ? 'badge-info' : booking.status == 'partially_paid' ? 'badge-warning' : booking.status == 'paid' ? 'badge-success' : booking.status == 'completed' ? 'badge-success' : booking.status == 'cancelled' ? 'badge-error' : ''}`}
          >
            {booking?.status}
          </span>
        </div>
      </div>
    )
  }


  return (
    <div>MessageAttachemnt</div>
  )
}
