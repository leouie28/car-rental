import React, { useEffect, useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Car, ChartColumnStacked, ChartPie, CircleUser, Clock, LayoutDashboard, LogOut, MapPinned, Menu, MessageSquareMore, X } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import socket from '../socket';

const navs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />
  },
  {
    name: "Reports",
    path: "/admin/reports",
    icon: <ChartColumnStacked />
  },
  {
    name: "Bookings",
    path: "/admin/bookings",
    icon: <Clock />
  },
  {
    name: "Cars",
    path: "/admin/cars",
    icon: <Car />
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageSquareMore />
  },
  {
    name: "Track",
    path: "/admin/track",
    icon: <MapPinned />
  },
  {
    name: "Drivers",
    path: "/admin/drivers",
    icon: <CircleUser />
  },
]

export default function AdminLayout() {
  const { user, loading, logout } = useSession()
  const location = useLocation()
  const { pathname } = location
  const navigate = useNavigate()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (loading) return
    if (!user?.isAdmin) {
      navigate("/")
    }

    socket.emit("join", "admin")
  }, [user, loading])
  
  return (
    <div className='relative h-full'>
      <div 
        className={`${show ? 'left-0' : ''} fixed -left-72 lg:left-0 top-0 flex flex-col justify-between w-72 h-full bg-black z-10 p-6 transition-all ease-in-out duration-600`}
      >
        <div>
          <button onClick={() => setShow(false)} className='btn btn-ghost lg:hidden'>
            <X color='white' />
          </button>
          {/* <button className='btn btn-ghost hidden lg:inline-flex'>
            <Menu color='white' />
          </button> */}
          <ul className="menu rounded-box w-full text-base-300 mt-20 space-y-2">
            {navs.map((nav, i) => (
              <li key={i}>
                <Link 
                  to={nav.path}
                  className={`${pathname === nav.path ? 'bg-primary/90 pointer-events-none' : ''} hover:bg-primary/60`}
                  onClick={() => setShow(false)}
                >
                  {nav.icon}
                  <span>{nav.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={() => logout()} className='btn btn-block'>
          <LogOut size={16} />
          Logout
        </button>
      </div>
      <div className='ml-0 lg:ml-72 relative bg-base-300 h-full'>
        <button onClick={() => setShow(true)} className='lg:hidden btn btn-ghost px-2 mt-2 ml-2 print:hidden'>
          <Menu color='gray' />
        </button>
        <Outlet />
      </div>
    </div>
  )
}
