import React, { useState } from 'react'
import Container from '../../components/Container'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { carDetails } from '../../rest/car'
import { Calendar, Check, CircleCheck, X } from 'lucide-react'
import dayjs from 'dayjs'
import { submitBooking } from '../../rest/booking'
import { getLicense, uploadLicense } from '../../rest/client'
import { useEffect } from 'react'

export default function BookingCreatePage() {
  const carId = useSearchParams()[0].get('carId')
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const now = dayjs().toDate()
  const [form, setForm] = useState({
    withDriver: false,
    dateStart: "",
    dateReturn: "",
    paymentOption: "cash",
    pickupLocation: "",
    destination: "",
    note: ""
  })

  const { data: license, refetch: refetchLicense } = useQuery({
    queryKey: ['client-license'],
    queryFn: getLicense,
    refetchOnWindowFocus: false,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['car-details', carId],
    queryFn: () => carDetails(carId),
    refetchOnWindowFocus: false,
    enabled: !!carId
  })

  const { mutate, isPending, error: bookingErr } = useMutation({
    mutationFn: submitBooking,
    onSuccess: (res) => { 
      setTimeout(() => {
        console.log(res, bookingErr, 'result')
        setStep(2)
      }, 1000)
    },
    onError: (error) => {
      console.error('Booking submission failed:', error)
      setStep(2)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    mutate({ ...form, carId })
  }

  const handleUploadLicense = async (file, type) => {
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64 = reader.result
      try {
        const res = await uploadLicense(base64, type)
        if (res.success) {
          refetchLicense()
          console.log('License uploaded successfully')
        } else {
          console.error('Failed to upload license:', res)
        }
      } catch (error) {
        console.error('Error uploading license:', error)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <dialog id="booking_result" open={step===2} className="modal backdrop-blur-xs">
        <div className="modal-box w-full max-w-xs rounded-2xl">
          <div className='w-full flex flex-col items-center gap-4'>
            {bookingErr ? (
              <>
                <div className='p-2 rounded-full bg-error/80 w-fit'>
                  <X className='text-white' />
                </div>
                <h3 className="font-bold text-error text-lg">Booking Failed!</h3>
                <p className="text-center text-base-content/80">
                  {bookingErr?.response?.data?.error || 'An error occurred while submitting your booking. Please try again.'}
                </p>
              </>
            ) : (
              <>
                <div className='p-2 rounded-full bg-success/80 w-fit'>
                  <Check className='text-white' />
                </div>
                <h3 className="font-bold text-lg">Booking Submitted!</h3>
                <p className="text-center text-base-content/80">You booking is submitted, admin will response to it immediately.</p>
              </>
            )}
          </div>
          <div className="modal-action">
            {bookingErr ? (
              <button className='btn btn-block btn-link' onClick={() => setStep(1)}>
                Change booking details
              </button>
            ) : (
              <button className='btn btn-block btn-link' onClick={() => navigate("/")}>
                Return to Car List
              </button>
            )}
          </div>
        </div>
      </dialog>
      <div className='bg-base-100 pb-10 pt-4'>
        <Container>
          <div className="card max-w-screen-md mx-auto border border-base-content/20">
            <form onSubmit={handleSubmit} className="card-body space-y-4">
              <h2 className='card-title'>CREATE BOOKING</h2>
              <div className='flex gap-4'>
                <div className='rounded-xl overflow-hidden w-2/5 aspect-video'>
                  {data?.images[0] ? (
                    <img 
                      className='object-cover h-full w-full object-center'
                      src={data?.images[0]?.base64}
                      alt='Car image'
                    />
                  ) : <div></div>}
                </div>
                <div className='space-y-1.5'>
                  <h3 className='card-title'>{data?.make} - {data?.model} {data?.year} ({data?.color})</h3>
                  <p className='capitalize'>Fuel: {data?.fuelType}</p>
                  <p className='capitalize'>Transmission: {data?.transmission}</p>
                  <p className='capitalize'>Seats: {data?.seatCount}</p>
                  <p className='capitalize'>Doors: {data?.doorCount}</p>
                  <p className='capitalize'>Security Deposit: ₱{data?.securityDeposit?.toLocaleString('en-US')||'0'}</p>
                </div>
              </div>
              <div className="divider"></div>
              <div className='grid grid-cols-2 gap-4'>
                <fieldset className="fieldset col-span-2">
                  <legend className="fieldset-legend">Service Type</legend>
                  <label className="label">
                    <input type="radio" name="type" className='radio' onChange={(e) => setForm((prev) => ({ ...prev, withDriver: !form.withDriver }))} checked={!form.withDriver} />
                    Self Drive (₱{data?.dailyPrice.toLocaleString('en-US')}/day)
                  </label>
                  <label className="label">
                    <input type="radio" name="type" className='radio' onChange={(e) => setForm((prev) => ({ ...prev, withDriver: e.target.checked }))} checked={form.withDriver} />
                    With Driver (₱{data?.withDriverDailyPrice.toLocaleString('en-US')}/day)
                  </label>
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Date Pickup</legend>
                  <input 
                    type="date" 
                    className="input w-full" 
                    name="dateStart"
                    min={now.toISOString().split('T')[0]}
                    value={form.dateStart ? dayjs(form.dateStart).format('YYYY-MM-DD') : ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, dateStart: new Date(e.target.value) }))}
                    required
                  />
                  {/* <p className="label">Optional</p> */}
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Date Return</legend>
                  <input 
                    disabled={!form.dateStart}
                    type="date" 
                    className="input w-full" 
                    name='dateReturn'
                    min={form.dateStart ? dayjs(form.dateStart).add(1, 'day').format('YYYY-MM-DD') : now.toISOString().split('T')[0]}
                    value={form.dateReturn ? dayjs(form.dateReturn).format('YYYY-MM-DD') : ''}
                    onChange={(e) => setForm((prev) => ({ ...prev, dateReturn: new Date(e.target.value) }))}
                    required
                  />
                  {/* <p className="label">Optional</p> */}
                </fieldset>
                <fieldset className={`fieldset ${form.withDriver ? 'hidden' : ''}`}>
                  <legend className="fieldset-legend">Front Drivers License</legend>
                  <input 
                    disabled={license?.images.some(img => img.type === 'front')}
                    type="file" 
                    className="file-input w-full" 
                    onChange={(e) => e.target.files[0] && handleUploadLicense(e.target.files[0], 'front')}
                  />
                </fieldset>
                <fieldset className={`fieldset ${form.withDriver ? 'hidden' : ''}`}>
                  <legend className="fieldset-legend">Back Drivers License</legend>
                  <input 
                    disabled={license?.images.some(img => img.type === 'back')}
                    type="file" 
                    className="file-input w-full" 
                    onChange={(e) => e.target.files[0] && handleUploadLicense(e.target.files[0], 'back')}
                  />
                </fieldset>
                <fieldset className={`fieldset ${!form.withDriver ? 'hidden' : ''}`}>
                  <legend className="fieldset-legend">Pickup Location</legend>
                  <input 
                    type="text" 
                    className="input w-full" 
                    value={form.pickupLocation}
                    onChange={(e) => setForm((prev) => ({ ...prev, pickupLocation: e.target.value }))}
                    placeholder="Enter pickup location"
                    required={form.withDriver}
                  />
                </fieldset>
                <fieldset className={`fieldset ${!form.withDriver ? 'hidden' : ''}`}>
                  <legend className="fieldset-legend">Destination</legend>
                  <input 
                    type="text" 
                    className="input w-full" 
                    value={form.destination}
                    onChange={(e) => setForm((prev) => ({ ...prev, destination: e.target.value }))}
                    placeholder="Enter destination"
                    required={form.withDriver}
                  />
                </fieldset>
                <fieldset className="fieldset col-span-2">
                  <legend className="fieldset-legend">Payment Option</legend>
                  <label className="label">
                    <input type="radio" name="payment" className='radio' defaultChecked />
                    Cash On Pickup
                  </label>
                </fieldset>
                <fieldset className="fieldset col-span-2">
                  <legend className="fieldset-legend">Optional Note</legend>
                  <textarea
                    className='w-full textarea'
                    placeholder='Write note for this booking...'
                    value={form.note}
                    onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                  ></textarea>
                </fieldset>
              </div>
              <div role="alert" className="alert alert-warning alert-soft">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Note: Lorem ipsum dolor sit amet consectetur adipisicing elit. Id possimus minima dolorum iste tempora excepturi minus explicabo debitis ipsa quae necessitatibus nesciunt commodi, laudantium recusandae beatae tenetur voluptate! Commodi, atque!</span>
              </div>
              {/* <div className="divider"></div> */}
              <div className='flex gap-3 justify-end'>
                <button disabled={isPending} type="button" className='btn btn-ghost'>
                  BACK TO CAR LIST
                </button>
                <button disabled={isPending} type="submit" className='btn btn-primary'>
                  <Calendar size={18} />
                  SUBMMIT BOOKING
                </button>
              </div>
            </form>
          </div>
        </Container>
      </div>
    </>
  )
}
