import React, { useState } from 'react'
import api from '../../lib/api'

export default function AdminLogin() {
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const res = await api.post("/auth/admin/login", { username, password })
      localStorage.setItem("token", res.data?.token)
      setTimeout(() => {
        window.location.href = '/admin/cars'
      }, 500)
    } catch (error) {
      console.log(error)
      setError(error?.response?.data?.message || "Invalid credentials")
    }
  }
  
  return (
    <div className='h-screen w-full flex items-center justify-center'>
      <div className="card max-w-sm">
        <div className="card-body">
          <h2 className='card-title'>Admin login</h2>
          <form onSubmit={handleLogin} className='space-y-6 mt-2'>
            <input 
              className='input w-full'
              placeholder='Username' 
              required
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              className='input w-full'
              placeholder='Password' 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div className='text-error text-center'>{error}</div>}
            <button className='btn btn-block btn-primary'>
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
