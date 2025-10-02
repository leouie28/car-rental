import React, { useEffect, useState } from 'react'
import Container from '../../components/Container'
import { Car, CircleUser, Clock, Printer, Users } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

export default function AdminReportsPage() {
  const [period, setPeriod] = useState('-6')
  const [start, setStart] = useState(dayjs().subtract(6, 'days').toDate())
  const [end, setEnd] = useState(dayjs().toDate())

  const { data: overview, isFetching: overviewLoading } = useQuery({
    queryKey: ['overview'],
    queryFn: async () => (await api.get('/admin/report/overview')).data,
  })

  const { data: detailed, isFetching: detailedLoading } = useQuery({
    queryKey: ['detailed', start, end],
    queryFn: async () => (await api.get('/admin/report/detailed', { params: { start, end } })).data,
  })

  const handeChangePeriod = (period) => {
    setPeriod(period)
    if (period == 'custom') return
    if (period == 'last_week') {
      setStart(dayjs().subtract(1, 'week').startOf('week').toDate())
      setEnd(dayjs().subtract(1, 'week').endOf('week').toDate())
    }else if (period == 'last_month') {
      setStart(dayjs().subtract(1, 'month').startOf('month').toDate())
      setEnd(dayjs().subtract(1, 'month').endOf('month').toDate())
    }else {
      setStart(dayjs().add(Number(period), 'days').toDate())
      setEnd(dayjs().toDate())
    }
  }

  return (
    <div className="py-10 min-h-screen">
      <Container>
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h1 className="text-2xl font-bold mb-4">Reports</h1>
            <button 
              className='btn btn-primary print:hidden'
              onClick={() => {
                window.print()
              }}
            >
              <Printer size={14} />
              Print
            </button>
          </div>
          <div className='space-y-4'>
            <h3>Overview</h3>
            <div className='grid grid-cols-2 md:flex gap-6 flex-wrap'>
              <div className="card bg-base-100 w-full md:w-52 print:border border-gray-300">
                <div className="card-body">
                  <Users />
                  <div>
                    Total Users: <span className='font-semibold'>{overview?.users}</span>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 w-full md:w-52 print:border border-gray-300">
                <div className="card-body">
                  <Car />
                  <div>
                    Total Cars: <span className='font-semibold'>{overview?.cars}</span>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 w-full md:w-52 print:border border-gray-300">
                <div className="card-body">
                  <CircleUser />
                  <div>
                    Total Drivers: <span className='font-semibold'>{overview?.drivers}</span>
                  </div>
                </div>
              </div>
              <div className="card bg-base-100 w-full md:w-52 print:border border-gray-300">
                <div className="card-body">
                  <Clock />
                  <div>
                    Total Booking: <span className='font-semibold'>{overview?.bookings}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='space-y-4'>
            <div>
              <fieldset className="fieldset col-span-2 md:col-span-1">
                <legend className="fieldset-legend">Period</legend>
                <div className='flex gap-2'>
                  <select
                    className='select w-full md:w-52 print:w-52'
                    value={period}
                    onChange={(e) => handeChangePeriod(e.target.value)}
                  >
                    <option value="" disabled>Select Period</option>
                    <option value="-6">Last 7 days</option>
                    <option value="-15">Last 15 days</option>
                    <option value="-29">Last 30 days</option>
                    <option value="last_week">Last week</option>
                    <option value="last_month">Last month</option>
                    {/* <option value="custom">Custom</option> */}
                  </select>
                </div>
              </fieldset>
            </div>
            <div className="card bg-base-100">
              <div className="card-body">
                <h2 className='card-title mb-4'>Booking Per Entry</h2>
                <ResponsiveContainer width="100%" minHeight={400}>
                  <LineChart
                    width={500}
                    height={300}
                    data={detailed||[]}
                    margin={{
                      top: 5,
                      right: 30,
                      // left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(date) => dayjs(date).format("MMM DD")} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        value,
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                    />
                    <Legend formatter={(value) =>
                      value.charAt(0).toUpperCase() + value.slice(1)
                    } />
                    <Line type="linear" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
                    {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
