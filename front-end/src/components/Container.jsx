import React from 'react'

export default function Container({ children }) {
  return (
    <div className='px-3 w-full md:px-6 xl:px-10 max-w-screen-xl mx-auto'>
        {children}
    </div>
  )
}
