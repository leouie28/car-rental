import React, { useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Car, ChartColumnStacked, ChartPie, CircleUser, Clock, MapPinned, Menu, MessageSquareMore } from 'lucide-react';
import { useSession } from '../context/SessionContext';

const navs = [
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
  const { user } = useSession()
  const location = useLocation()
  const { pathname } = location
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      if (!user?.isAdmin) {
        navigate("/")
      }
    }
  }, [user])
  
  return (
    <div className='relative h-full'>
      <div className='fixed -left-72 lg:left-0 top-0 w-72 h-full bg-black z-10 p-6'>
        <button className='btn btn-ghost'>
          <Menu color='white' />
        </button>
        <ul className="menu rounded-box w-full text-base-300 mt-20 space-y-2">
          {navs.map((nav, i) => (
            <li key={i}>
              <Link 
                to={nav.path}
                className={`${pathname === nav.path ? 'bg-primary/90 pointer-events-none' : ''} hover:bg-primary/60`}
              >
                {nav.icon}
                <span>{nav.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className='ml-0 lg:ml-72 relative bg-base-300 h-full'>
        <Outlet />
      </div>
    </div>
  )
}
