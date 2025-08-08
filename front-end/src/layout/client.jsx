import React, { useEffect } from 'react'
import { Outlet, Link } from "react-router-dom";
import Container from '../components/Container';
import logo from './../assets/icon.png'
import { Bell, ChevronDown, MessageSquareMore } from 'lucide-react';
import LoginSignInDialog from '../components/LoginSignInDialog';
import { useSession } from '../context/SessionContext';
import ClientMessage from '../components/ClientMessage';

export default function ClientLayout() {
  const { user } = useSession()

  return (
    <div className='h-screen w-full relative'>
      <header className='fixed top-0 left-0 w-full h-[88px] bg-base-100 z-10'>
        <Container>
          <nav className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-10'>
              <img src={logo} className='w-42 h-22 object-cover' />
              {/* <div className='px-2 text-sm font-bold'>
                SELF DRIVE
              </div>
              <div className='px-2 text-sm font-bold'>
                PICK-UP
              </div> */}
            </div>
            <div className='flex gap-10'>
              {user && !user?.isAdmin ? (
                <>
                  <button className='flex items-center gap-2 cursor-pointer hover:opacity-70'>
                    <span className='indicator'>
                      <span className="indicator-item badge badge-error badge-xs">12</span>
                      Booking
                    </span>
                  </button>
                  <button className='flex items-center gap-2 cursor-pointer hover:opacity-70'>
                    {user?.firstName} {user?.lastName}
                    <ChevronDown size={16} />
                  </button>
                </>
              ) : <LoginSignInDialog />}
            </div>
          </nav>
        </Container>
      </header>
      <main className='pt-[88px] h-full'>
        <Outlet />
      </main>
      <ClientMessage />
    </div>
  )
}
