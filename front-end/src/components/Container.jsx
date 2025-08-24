import React from 'react'

export default function Container({ children, fullHeight }) {
  return (
    <div className={`px-3 w-full md:px-6 xl:px-10 max-w-screen-2xl mx-auto ${fullHeight?'h-full':''}`}>
        {children}
    </div>
  )
}
