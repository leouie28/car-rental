import React, { useState } from 'react'
import Container from '../../../components/Container'
import { ImageUp } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { addCar } from '../../../rest/admin/car'
import { useNavigate } from 'react-router-dom'

const emptyForm = {
  make: "",
  model: "",
  year: 2010,
  color: "",
  transmission: "",
  fuelType: "",
  seatCount: null,
  doorCount: null,
  otherDetails: "",
  features: "",
  dailyPrice: 0,
  withDriverDailyPrice: 0
}

export default function AdminCarForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)

  const { mutate, isPending } = useMutation({
    mutationFn: addCar,
    onSuccess: () => {
      setForm(emptyForm)
      navigate("/admin/cars")
    }
  })

  return (
    <div className='py-10'>
      <Container>
        <div className='space-y-4'>
          <h1 className='text-2xl font-semibold'>Add new car</h1>
          <div className="card bg-base-100">
            <div className="card-body">
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  mutate(form)
                }} 
                className=''
              >
                <h2 className='card-title'>Details</h2>
                <div className='grid grid-cols-3 gap-3'>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Brand (Maker)</legend>
                    <input 
                      type="text" 
                      className="input w-full" 
                      required
                      value={form.make}
                      onChange={(e) => setForm(prev => ({ ...prev, make: e.target.value }))}
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Model</legend>
                    <input 
                      type="text" 
                      className="input w-full" 
                      required
                      value={form.model}
                      onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Year</legend>
                    <input 
                      type="text" 
                      className="input w-full" 
                      required
                      value={form.year}
                      onChange={(e) => setForm(prev => ({ ...prev, year: Number(e.target.value) }))}
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Color</legend>
                    <input 
                      type="text" 
                      className="input w-full" 
                      required
                      value={form.color}
                      onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Transmission</legend>
                    <select 
                      className='select w-full'
                      required
                      value={form.transmission}
                      onChange={(e) => setForm(prev => ({ ...prev, transmission: e.target.value }))}
                    >
                      <option value="">Select transmission</option>
                      <option value="manual">Manual</option>
                      <option value="automatic">Automatic</option>
                      <option value="semi_automatic">Semi Automatic</option>
                    </select>
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Fuel</legend>
                    <select 
                      className='select w-full'
                      required
                      value={form.fuelType}
                      onChange={(e) => setForm(prev => ({ ...prev, fuelType: e.target.value }))}
                    >
                      <option value="">Select fuel</option>
                      <option value="diesel">Diesel</option>
                      <option value="gasoline">Gasoline</option>
                    </select>
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Seat Count</legend>
                    <input 
                      type="number" 
                      className="input w-full" 
                      required
                      value={form.seatCount === null ? '' : form.seatCount}
                      onChange={(e) => setForm(prev => ({ ...prev, seatCount: e.target.value === '' ? null : Number(e.target.value) }))}
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Door Count</legend>
                    <input 
                      type="number" 
                      className="input w-full" 
                      required
                      value={form.doorCount === null ? '' : form.doorCount}
                      onChange={(e) => setForm(prev => ({ ...prev, doorCount: e.target.value === '' ? null : Number(e.target.value) }))}
                    />
                  </fieldset>
                  <fieldset className="fieldset col-span-3">
                    <legend className="fieldset-legend">Other details</legend>
                    <textarea 
                      className='w-full textarea'
                      placeholder='Optional'
                      value={form.otherDetails}
                      onChange={(e) => setForm(prev => ({ ...prev, otherDetails: e.target.value }))}
                    ></textarea>
                  </fieldset>
                  <fieldset className="fieldset col-span-3">
                    <legend className="fieldset-legend">Features</legend>
                    <textarea 
                      className='w-full textarea'
                      placeholder={`- Bluetooth\n- Dash Cam`}
                      value={form.features}
                      onChange={(e) => setForm(prev => ({ ...prev, features: e.target.value }))}
                    ></textarea>
                  </fieldset>
                </div>
                <h2 className='card-title mt-4'>Daily Pricing</h2>
                <div className='grid grid-cols-3 gap-3'>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Self Drive</legend>
                    <input 
                      type="number" 
                      className="input w-full" 
                      required
                      value={form.dailyPrice}
                      onChange={(e) => setForm(prev => ({ ...prev, dailyPrice: e.target.value === '' ? 0 : Number(e.target.value) }))}
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">With Driver</legend>
                    <input 
                      type="number" 
                      className="input w-full" 
                      required
                      value={form.withDriverDailyPrice}
                      onChange={(e) => setForm(prev => ({ ...prev, withDriverDailyPrice: e.target.value === '' ? 0 : Number(e.target.value) }))}
                    />
                  </fieldset>
                </div>
                <h2 className='card-title mt-4'>Images</h2>
                <div className='flex flex-wrap gap-3 my-2'>
                  <div className='bg-base-200 text-base-content/60 hover:text-base-content/90 hover:underline active:scale-101 border border-base-content/20 border-dashed aspect-[3/2] w-32 rounded-lg flex flex-col justify-center items-center cursor-pointer'>
                    <ImageUp size={18} />
                    Upload
                  </div>
                </div>
                <div className='flex justify-end gap-2'>
                  <button 
                    type="reset" 
                    className='btn btn-ghost'
                    disabled={isPending}
                  >
                    Reset
                  </button>
                  <button 
                    type="submit" 
                    className='btn btn-primary'
                    disabled={isPending}
                  >
                    {isPending ? 'Processing...' : 'Add Car'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
