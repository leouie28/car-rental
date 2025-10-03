import React, { useRef, useState } from 'react'
import Container from '../../../components/Container'
import { ImageUp } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { addCar } from '../../../rest/admin/car'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../../lib/api'
import { useEffect } from 'react'
import { useLocation } from "react-router-dom";

const emptyForm = {
  type: "",
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
  securityDeposit: '',
  dailyPrice: '',
  withDriverDailyPrice: '',
  images: []
}

export default function AdminCarForm() {
  const { id: carId } = useParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const imgInputRef = useRef(null)
  const [imgLoading, setImgLoading] = useState(false)
  const [readOnly, setReadOnly] = useState(false)

  const { data: car } = useQuery({
    queryKey: ['car', carId],
    queryFn: async () => (await api.get(`/admin/car/${carId}`)).data,
    enabled: !!carId
  })

  useEffect(() => {
    if (car) {
      setForm(car)
      const strs = pathname.split('/')
      if (strs.at(-1)!=="edit") {
        setReadOnly(true)
      }
    }
  }, [car])

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        dailyPrice: Number(form.dailyPrice??'0'),
        securityDeposit: Number(form.securityDeposit??'0'),
        withDriverDailyPrice: Number(form.withDriverDailyPrice??'0')
      }
      return await addCar(payload)
    },
    onSuccess: () => {
      setForm(emptyForm)
      navigate("/admin/cars")
    }
  })

  const { mutate: edit, isPending: isEditLoading } = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        dailyPrice: form.dailyPrice || 0
      }
      return await (await api.put(`/admin/car/${carId}`, payload)).data
    },
    onSuccess: () => {
      setForm(emptyForm)
      navigate("/admin/cars")
    }
  })

  const handleImageChange = async (e) => {
    const files = e.target.files;
    if (!files.length) return
    
    setImgLoading(true);

    const uploadedImages = await Promise.all(
      Array.from(files).map(
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
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedImages],
    }));

    setImgLoading(false);
  };

  return (
    <div className='py-10'>
      <Container>
        <div className='space-y-4'>
          <h1 className='text-2xl font-semibold'>
            {readOnly ? 'View Car' : carId ? 'Edit Car' : 'Add New Car'}
          </h1>
          <div className="card bg-base-100">
            <div className="card-body">
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  const payload = {
                    ...form,
                    securityDeposit: form.securityDeposit ? Number(form.securityDeposit) : null,
                    dailyPrice: Number(form.dailyPrice),
                    withDriverDailyPrice: Number(form.withDriverDailyPrice)
                  }
                  if (carId) {
                    edit(payload)
                  }else {
                    mutate(payload)
                  }
                }} 
                className=''
              >
                <h2 className='card-title'>Details</h2>
                <div className='grid grid-cols-2 lg:grid-cols-3 gap-3'>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Brand (Maker)</legend>
                    <input 
                      type="text" 
                      className="input w-full" 
                      name="make"
                      required
                      value={form.make}
                      onChange={(e) => setForm(prev => ({ ...prev, make: e.target.value }))}
                      readOnly={readOnly}
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
                      readOnly={readOnly}
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
                      readOnly={readOnly}
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Type</legend>
                    <select 
                      className={`select w-full ${readOnly?'pointer-events-none':''}`}
                      required
                      value={form.type}
                      onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="" disabled>Select type</option>
                      <option value="sedan">Sedan</option>
                      <option value="suv">Suv</option>
                      <option value="pickup">Pickup</option>
                      <option value="minivan">Minivan</option>
                      <option value="van">Van</option>
                      <option value="compact">Compact</option>
                      <option value="economy">Economy</option>
                    </select>
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Color</legend>
                    <input 
                      type="text" 
                      className="input w-full" 
                      required
                      value={form.color}
                      onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))}
                      readOnly={readOnly}
                    />
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Transmission</legend>
                    <select 
                      className={`select w-full ${readOnly?'pointer-events-none':''}`}
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
                      className={`select w-full ${readOnly?'pointer-events-none':''}`}
                      required
                      value={form.fuelType}
                      onChange={(e) => setForm(prev => ({ ...prev, fuelType: e.target.value }))}
                      readOnly={readOnly}
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
                      readOnly={readOnly}
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
                      readOnly={readOnly}
                    />
                  </fieldset>
                  <fieldset className="fieldset col-span-3">
                    <legend className="fieldset-legend">Other details</legend>
                    <textarea 
                      className='w-full textarea'
                      placeholder='Optional'
                      value={form.otherDetails}
                      onChange={(e) => setForm(prev => ({ ...prev, otherDetails: e.target.value }))}
                      readOnly={readOnly}
                    ></textarea>
                  </fieldset>
                  <fieldset className="fieldset col-span-3">
                    <legend className="fieldset-legend">Features</legend>
                    <textarea 
                      className='w-full textarea'
                      placeholder={`- Bluetooth\n- Dash Cam`}
                      value={form.features}
                      onChange={(e) => setForm(prev => ({ ...prev, features: e.target.value }))}
                      readOnly={readOnly}
                    ></textarea>
                  </fieldset>
                </div>
                <h2 className='card-title mt-4'>Pricing</h2>
                <div className='grid grid-cols-3 gap-3'>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Security Deposit</legend>
                    <label className='input w-full'>
                      <span>₱</span>
                      <input 
                        type="number" 
                        className="grow" 
                        value={form.securityDeposit}
                        onChange={(e) => setForm(prev => ({ ...prev, securityDeposit: e.target.value }))}
                        readOnly={readOnly}
                      />
                    </label>
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Self Drive</legend>
                    <label className='input w-full'>
                      <span>₱</span>
                      <input 
                        type="number" 
                        className="grow" 
                        value={form.dailyPrice}
                        onChange={(e) => setForm(prev => ({ ...prev, dailyPrice: e.target.value }))}
                        readOnly={readOnly}
                      />
                    </label>
                  </fieldset>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">With Driver</legend>
                    <label className='input w-full'>
                      <span>₱</span>
                      <input 
                        type="number" 
                        className="grow" 
                        value={form.withDriverDailyPrice}
                        onChange={(e) => setForm(prev => ({ ...prev, withDriverDailyPrice: e.target.value }))}
                        readOnly={readOnly}
                      />
                    </label>
                  </fieldset>
                </div>
                <h2 className='card-title mt-4'>Images</h2>
                <input 
                  type="file"
                  ref={imgInputRef} 
                  className='hidden'
                  accept='image/*'
                  multiple
                  onChange={handleImageChange}
                />
                <div className='grid grid-cols-4 gap-4 my-2'>
                  {form.images.map((img, i) => (
                    <img 
                      key={i} 
                      className='w-full aspect-[3/2] rounded-lg object-cover object-center'
                      src={img?.base64}
                      alt="Car image"
                    />
                  ))}
                  {!readOnly && (
                    <div 
                      className='bg-base-200 text-base-content/60 hover:text-base-content/90 hover:underline active:scale-101 border border-base-content/20 border-dashed aspect-[3/2] w-full rounded-lg flex flex-col gap-2 justify-center items-center cursor-pointer'
                      onClick={() => imgInputRef?.current?.click()}
                    >
                      <ImageUp size={24} />
                      Add Images
                    </div>
                  )}
                </div>
                <div className='flex justify-end gap-2'>
                  {carId ? (
                    <button 
                      type="button" 
                      className='btn btn-ghost'
                      onClick={() => navigate('/admin/cars')}
                    >
                      Back
                    </button>
                  ) : (
                    <button 
                      type="reset" 
                      className='btn btn-ghost'
                      disabled={isPending}
                    >
                      Reset
                    </button>
                  )}
                  {readOnly ? (
                    <button 
                      type="button" 
                      className='btn btn-primary'
                      onClick={() => {
                        return window.location = `/admin/cars/${carId}/edit`
                      }}
                    >
                      Edit Car
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      className='btn btn-primary'
                      disabled={isPending||imgLoading}
                    >
                      {isPending ? 'Processing...' : 'Submit'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
