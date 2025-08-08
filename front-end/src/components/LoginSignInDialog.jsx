import React, { useState } from 'react'
import api from '../lib/api'

export default function LoginSignInDialog() {
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setLoginError("")
    try {
      const res = await api.post('/auth/client/login', loginForm)
      console.log(res.data.token)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
    } catch (error) {
      setLoginError(error?.response?.data?.message || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className='space-x-2'>
        <button onClick={() => setActive("login")} className='btn btn-link'>
          Login
        </button>
        <button onClick={() => setActive("register")} className='btn btn-primary'>
          Register
        </button>
      </div>
      <dialog 
        open={active} 
        id="login_signin_dialog" 
        className="modal backdrop-blur-xs"
        onClose={() => setActive(null)}
      >
        <div className="modal-box max-w-sm w-full">
          <form onSubmit={handleLogin}>
            <div className='space-y-4'>
              <h3 className="font-bold text-lg">Login</h3>
              <input value={loginForm.email} onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))} name="email" type="email" className='input w-full' placeholder='Email address' />
              <input value={loginForm.password} onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))} type="password" className='input w-full' placeholder='Password' />
              {loginError && <p className='text-sm text-center text-error'>{loginError}</p>}
            </div>
            <div className="modal-action">
              <button disabled={loading} type="submit" className='btn btn-block btn-primary'>
                Login
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
