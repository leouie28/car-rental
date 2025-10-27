import React, { useEffect, useState } from 'react'
import Container from '../components/Container'
import { PenSquare, Save } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import toast from 'react-hot-toast'

export default function AccountPage() {
  const [isEdit, setIsEdit] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    address: '',
    phone: '',
    email: '',
    password: ''
  })

  const { data: user, refetch } = useQuery({
    queryKey: ['info'],
    queryFn: async () => (await api.get('/client')).data
  })

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        birthDate: user.birthDate ?? '',
        address: user.address ?? '',
        phone: user.phone ?? '',
        email: user.email ?? '',
        password: ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const { mutate, isPending } = useMutation({
    mutationFn: async () => (await api.put('/client', form)).data,
    onSuccess: (data) => {
      toast.success('Update saved successfully!')
      refetch()
      setIsEdit(false)
    }
  })

  return (
    <div className="bg-base-100 py-10 pt-4">
      <Container>
        <div className="card bg-base-100 max-w-2xl mx-auto shadow-md border border-base-300">
          <div className="card-body space-y-4">
            <h2 className='card-title'>Profile</h2>
            <div>
              <div className='grid grid-cols-2 gap-4'>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">First Name</legend>
                  <input 
                    type="text" 
                    className="input w-full" 
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    disabled={!isEdit}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Last Name</legend>
                  <input 
                    type="text" 
                    className="input w-full" 
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    disabled={!isEdit}
                  />
                </fieldset>
              </div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Birthdate</legend>
                <input 
                  type="date" 
                  className="input w-full" 
                  name="birthdate"
                  value={form.birthDate}
                  onChange={handleChange}
                  required
                  disabled={!isEdit}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Address</legend>
                <input 
                  type="text" 
                  className="input w-full" 
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  disabled={!isEdit}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Phone Number</legend>
                <input 
                  type="text" 
                  className="input w-full" 
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  disabled={!isEdit}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Email</legend>
                <input 
                  type="text" 
                  className="input w-full" 
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Password</legend>
                <input 
                  type="text" 
                  className="input w-full" 
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={!isEdit}
                />
              </fieldset>
              {user?.license?.length > 0 && !isEdit &&  (
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">License</legend>
                  <div className='flex gap-4 flex-wrap'>
                    {user?.license[0]?.images?.map((img, i) => (
                      <img key={i} src={img?.base64} className='aspect-[3/2] w-52 rounded-lg' />
                    ))}
                  </div>
                </fieldset>
              )}
            </div>
            <div className='flex justify-end gap-2'>
              {isEdit ? (
                <>
                  <button disabled={isPending} className='btn btn-ghost' onClick={() => setIsEdit(false)}>
                    Cancel
                  </button>
                  <button disabled={isPending} className='btn btn-primary' onClick={mutate}>
                    <Save size={16} />
                    {isPending?'Saving':'Save'}
                  </button>
                </>
              ) : (
                <button className='btn' onClick={() => setIsEdit(true)}>
                  <PenSquare size={16} />
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
