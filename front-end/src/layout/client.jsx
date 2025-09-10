import React, { useEffect } from 'react'
import { Outlet, Link } from "react-router-dom";
import Container from '../components/Container';
import logo from './../assets/icon.png'
import { Bell, ChevronDown, Clock, LogOut, MessageSquareMore, User } from 'lucide-react';
import LoginSignInDialog from '../components/LoginSignInDialog';
import { useSession } from '../context/SessionContext';
import ClientMessage from '../components/ClientMessage';
import { useState } from 'react';
import socket from '../socket';

export default function ClientLayout() {
  const { user, logout } = useSession()
  const userId = user?.id
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!userId) return
    socket.emit("join", userId)

    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((pos) => {
        socket.emit("driver_location", {
          driverId: userId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [userId])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [])

  return (
    <div className='h-screen w-full relative'>
      <header className={`fixed top-0 left-0 w-full h-[88px] bg-base-100 z-10 ${scrolled ? 'shadow-lg' : ''}`}>
        <Container>
          <nav className='flex items-center justify-between gap-4'>
            <Link to="/" className='flex items-center gap-10'>
              <img src={logo} className='w-42 h-22 object-cover' />
            </Link>
            <div className='flex gap-10'>
              {user && !user?.isAdmin ? (
                <>
                  <Link to="/booking" className='flex items-center gap-2 cursor-pointer hover:text-primary hover:opacity-70'>
                    <Clock size={20} />
                    Booking
                    {/* <span className='indicator'>
                      <span className="indicator-item badge badge-error badge-xs">12</span>
                      Booking
                    </span> */}
                  </Link>
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="flex items-center gap-2 cursor-pointer focus:text-primary hover:text-primary hover:opacity-70">
                      <User size={20} />
                      <span className='hidden md:inline'>{user?.firstName} {user?.lastName}</span>
                      <ChevronDown size={16} />
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-44 p-2 shadow-sm">
                      <li>
                        <button
                          onClick={(e) => {
                            e.currentTarget.blur()
                            e.preventDefault()
                          }}
                        >
                          <User size={16} />
                          Account
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={(e) => {
                            e.currentTarget.blur()
                            e.preventDefault()
                            logout()
                          }}
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              ) : <LoginSignInDialog />}
            </div>
          </nav>
        </Container>
      </header>
      <main className='pt-[88px] h-full'>
        <Outlet />
      </main>
      {(user && !user?.isAdmin) && <ClientMessage />}
    </div>
  )
}
