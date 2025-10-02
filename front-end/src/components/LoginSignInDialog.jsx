import React, { useState } from 'react'
import api from '../lib/api'
import { useMutation } from '@tanstack/react-query'

export default function LoginSignInDialog() {
  const [active, setActive] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [registerError, setRegisterError] = useState("")
  const [regLoading, setRegLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    code: ""
  })

  const { mutate: reqCodeMt, isPending, isSuccess } = useMutation({
    mutationFn: async () => (await api.get(`/auth/client/request-code`, { params: { email: registerForm.email } })).data
  })

  const { mutate: verifyMt } = useMutation({
    mutationFn: async () => (await api.post(`/auth/client`, registerForm)).data,
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token)
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
    },
    onError: (error) => {
      setRegLoading(false)
      setRegisterError(error?.response?.data?.message || "Verify failed")
    },
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
          {active == "register" ? (
            <div className="modal-box max-w-md w-full">
              {isSuccess ? (
                <form onSubmit={(e) => {
                  e.preventDefault()
                  setRegisterError("")
                  setRegLoading(true)
                  verifyMt()
                }}>
                  <h3 className="font-bold text-lg">Verification</h3>
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Code</legend>
                    <input 
                      type="text" 
                      className="input w-full" 
                      required
                      placeholder='Enter verification code'
                      value={registerForm.code}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, code: e.target.value }))}
                    />
                    {registerError ? (
                      <p className='fieldset-label text-error'>{registerError}</p>
                    ) : (
                      <p className='fieldset-label'>We sent verification code to your email.</p>
                    )}
                  </fieldset>
                  <div className='flex justify-end'>
                    <button disabled={regLoading} className='btn btn-primary' type="submit">
                      Verify
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault()
                  reqCodeMt()
                }}>
                  <div className='space-y-4'>
                    <h3 className="font-bold text-lg">Register</h3>
                    <div className='grid grid-cols-2 gap-2'>
                      <input value={registerForm.firstName} onChange={(e) => setRegisterForm(prev => ({ ...prev, firstName: e.target.value }))} name="firstName" className='input w-full' placeholder='First name' />
                      <input value={registerForm.lastName} onChange={(e) => setRegisterForm(prev => ({ ...prev, lastName: e.target.value }))} name="lastName" className='input w-full' placeholder='Last name' />
                    </div>
                    <input value={registerForm.phone} onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))} name="phone" className='input w-full' placeholder='Phone number' />
                    <input value={registerForm.email} onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))} name="email" type="email" className='input w-full' placeholder='Email address' />
                    <input value={registerForm.password} onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))} type="password" className='input w-full' placeholder='Password' />
                    {registerError && <p className='text-sm text-center text-error'>{registerError}</p>}
                  </div>
                  <div className="modal-action">
                    <button disabled={isPending} type="submit" className='btn btn-block btn-primary'>
                      Register
                    </button>
                  </div>
                  <p className='text-center mt-4'>Already have an account? <span onClick={() => setActive("login")} className='text-primary cursor-pointer hover:underline'>Login here</span></p>
                </form>
              )}
            </div>
          ) : (
            <div className="modal-box max-w-sm w-full">
              <form onSubmit={handleLogin}>
                <div className='space-y-4'>
                  <h3 className="font-bold text-lg">Login to continue</h3>
                  <input value={loginForm.email} onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))} name="email" type="email" className='input w-full' placeholder='Email address' />
                  <input value={loginForm.password} onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))} type="password" className='input w-full' placeholder='Password' />
                  {loginError && <p className='text-sm text-center text-error'>{loginError}</p>}
                </div>
                <div className="modal-action">
                  <button disabled={loading} type="submit" className='btn btn-block btn-primary'>
                    Login
                  </button>
                </div>
                <p className='text-center mt-4'>Don't have an account? <span onClick={() => setActive("register")} className='text-primary cursor-pointer hover:underline'>Register here</span></p>
              </form>
            </div>
          )}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}
