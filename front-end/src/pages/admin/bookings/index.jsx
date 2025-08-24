import React, { useState } from "react";
import Container from "../../../components/Container";
import { useMutation, useQuery } from '@tanstack/react-query'
import { getCars } from '../../../rest/admin/car'
import { CircleCheckBig, Ellipsis, Eye, Plus, SquarePen, Trash2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getBookings, updateBookingStatus } from "../../../rest/admin/booking";
import dayjs from "dayjs";

export default function AdminBookingsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [searchText, setSearchText] = useState("")
  
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-bookings', status, search],
    queryFn: () => getBookings({
      search,
      status
    }),
    refetchOnWindowFocus: false
  })

  const { mutate } = useMutation({
    mutationFn: updateBookingStatus,
    onSuccess: () => refetch()
  })

  return (
    <div className="py-10 min-h-screen">
      <Container>
        <div>
          <h1 className="text-2xl font-bold mb-4">Bookings</h1>
          <div className="card bg-base-100">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <select 
                    className="select w-32"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="partially_paid">Partially Paid</option>
                    <option value="paid">Fully Paid</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <input 
                    placeholder="Search booking..."
                    type="search"
                    className="input w-80"
                    value={searchText}
                    onChange={(e) => {
                      const val = e.target.value
                      setSearchText(val)
                      if (!val) setSearch(val)
                    }}
                  />
                  <button className="btn" onClick={() => setSearch(searchText)}>
                    Search
                  </button>
                </div>
                {/* <div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate("/admin/cars/create")}
                  >
                    <Plus size={18} />
                    Add new car
                  </button>
                </div> */}
              </div>
              {/* <div className="flex items-center gap-2 my-2">
                  <select
                    className="select"
                  >
                    <option value="all">All</option>
                  </select>
              </div> */}
              <div className="overflow-x-auto mt-3">
                <table className="table table-zebra table-md">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Selected Car</th>
                      <th>Date Start</th>
                      <th>Date Return</th>
                      <th>With Driver</th>
                      <th>Number of Days</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.rows.map((d, i) => (
                      <tr key={d.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <User size={16} />
                            <span className="text-sm">{d?.user?.firstName} {d?.user?.lastName}</span>
                          </div>
                        </td>
                        <td>
                          {d?.car?.make} - {d?.car?.model} {d?.car?.year} ({d?.car?.color})
                        </td>
                        <td>{dayjs(d?.dateStart).format('MMM DD YYYY')}</td>
                        <td>{dayjs(d?.dateReturn).format('MMM DD YYYY')}</td>
                        <td>
                          {d?.withDriver ? <CircleCheckBig /> : null}
                        </td>
                        <td>{d?.daysBooked}</td>
                        <td>₱{d?.totalPrice.toLocaleString('en-US')}</td>
                        <td>
                          <span 
                            className={`badge badge-sm uppercase ${d.status == 'confirmed' ? 'badge-info' : d.status == 'partially_paid' ? 'badge-warning' : d.status == 'paid' ? 'badge-success' : d.status == 'completed' ? 'badge-success' : d.status == 'cancelled' ? 'badge-error' : ''}`}
                          >
                            {d?.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-primary" popoverTarget={`popover-${i}`} style={{ anchorName: `--anchor-${i}` }}>
                            Action
                            <Ellipsis size={16} />
                          </button>

                          <ul 
                            className="dropdown dropdown-end menu w-auto rounded-box bg-base-100 shadow-sm"
                            popover="auto" id={`popover-${i}`} style={{ positionAnchor: `--anchor-${i}` }}
                          >
                            <li onClick={() => mutate({ id: d.id, status: 'confirmed'})} className={`${d.status == 'confirmed' ? 'pointer-events-none opacity-60' : ''}`}>
                              <a>Mark as Confirmed</a>
                            </li>
                            <li onClick={() => mutate({ id: d.id, status: 'partially_paid' })} className={`${d.status == 'partially_paid' ? 'pointer-events-none opacity-60' : ''}`}>
                              <a>Mark as Partially Paid</a>
                            </li>
                            <li onClick={() => mutate({ id: d.id, status: 'paid' })} className={`${d.status == 'paid' ? 'pointer-events-none opacity-60' : ''}`}>
                              <a>Mark as Fully Paid</a>
                            </li>
                            <li onClick={() => mutate({ id: d.id, status: 'completed' })} className={`${d.status == 'completed' ? 'pointer-events-none opacity-60' : ''}`}>
                              <a>Mark as Completed</a>
                            </li>
                            <li onClick={() => mutate({ id: d.id, status: 'cancelled' })} className={`${d.status == 'cancelled' ? 'pointer-events-none opacity-60' : ''}`}>
                              <a>Mark as Cancelled</a>
                            </li>
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
