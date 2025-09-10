import React, { useEffect, useState } from 'react'
import carImage from './../../../public/car2.png'
import { FileQuestionMark } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api'
import dayjs from 'dayjs'
export default function BookingPage() {
  const [tab, setTab] = useState("active")
  const [items, setItems] = useState([])

  const { data, isLoading} = useQuery({
    queryKey: ['client-bookings'],
    queryFn: async () => (await api.get('/booking')).data,
    refetchOnWindowFocus: false
  })

  const now = new Date()

  const active = data?.filter((b) => new Date(b?.dateStart) <= now && new Date(b?.dateReturn) >= now) || []

  const incoming = data?.filter((b) => new Date(b?.dateStart) > now) || []

  const previous = data?.filter((b) => new Date(b?.dateStart) < now) || []

  useEffect(() => {
    if (data) {
      if (tab == "active") setItems(active)
      if (tab == "incoming") setItems(incoming)
      if (tab == "previous") setItems(previous)
    }
  }, [tab, data])

  return (
    <div className="bg-base-100 pb-10 pt-4">
      <div className='w-full md:w-3xl mx-auto p-4'>
        <div className="tabs tabs-box grid grid-cols-3">
          <input type="radio" name="booking_tab" className="tab" onClick={() => setTab("active")} aria-label="Active" defaultChecked={tab=="active"} />
          <input type="radio" name="booking_tab" className="tab" onClick={() => setTab("incoming")} aria-label="Incoming" defaultChecked={tab=="incoming"} />
          <input type="radio" name="booking_tab" className="tab" onClick={() => setTab("previous")} aria-label="Previous" defaultChecked={tab=="previous"} />
        </div>
        <div className='space-y-4 mt-4'>
          {items.length ? items.map((b) => (
            <div key={b?.id} className="collapse collapse-arrow bg-base-200 border border-base-300">
              <input type="checkbox" />
              <div className="collapse-title">
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
              </div>
              <div className="collapse-content text-sm">
                <div className="divider"></div>
                <ul className='space-y-2 capitalize'>
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
                </ul>
              </div>
            </div>
          )) : (
            <div className='p-10 text-center'>
              No {tab} booking...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
