import React from 'react'
import Container from '../components/Container'
import { PenSquare } from 'lucide-react'

export default function AccountPage() {
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
                    required
                    // value={form.model}
                    // onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                    // readOnly={readOnly}
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Last Name</legend>
                  <input 
                    type="text" 
                    className="input w-full" 
                    required
                    // value={form.model}
                    // onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                    // readOnly={readOnly}
                  />
                </fieldset>
              </div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Birthdate</legend>
                <input 
                  type="date" 
                  className="input w-full" 
                  required
                  // value={form.model}
                  // onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                  // readOnly={readOnly}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Address</legend>
                <input 
                  type="text" 
                  className="input w-full" 
                  required
                  // value={form.model}
                  // onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                  // readOnly={readOnly}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Phone Number</legend>
                <input 
                  type="text" 
                  className="input w-full" 
                  required
                  // value={form.model}
                  // onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                  // readOnly={readOnly}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Email</legend>
                <input 
                  type="text" 
                  className="input w-full" 
                  required
                  // value={form.model}
                  // onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                  // readOnly={readOnly}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Password</legend>
                <input 
                  type="text" 
                  className="input w-full" 
                  required
                  // value={form.model}
                  // onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                  // readOnly={readOnly}
                />
              </fieldset>
            </div>
            <div className='flex justify-end'>
              <button className='btn'>
                <PenSquare size={16} />
                Edit
              </button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
