import React from 'react'
import Container from '../../../components/Container'

export default function TrackPage() {
  return (
    <div className='bg-base-300 w-full h-screen py-10'>
      <Container>
        <div className='space-y-8'>
          <div className="card bg-base-100">
            <div className="card-body">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Select Car to track</legend>
                <select className='select' defaultValue="">
                  <option value="" disabled>Select car</option>
                </select>
                {/* <p className="label">You can edit page title later on from settings</p> */}
              </fieldset>
            </div>
          </div>
          <div className="card bg-base-100">
            <div className="card-body">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d976.2696368339606!2d124.59467165711717!3d12.067423566769769!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sph!4v1754094917214!5m2!1sen!2sph"
                // width={600}
                height={450}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              ></iframe>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
