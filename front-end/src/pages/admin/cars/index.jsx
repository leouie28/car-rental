import React, { useState } from "react";
import Container from "../../../components/Container";
import { useQuery } from '@tanstack/react-query'
import { getCars } from '../../../rest/admin/car'
import { Ellipsis, Eye, Plus, SquarePen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminCarsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [searchText, setSearchText] = useState("")
  
  const { data, isLoading } = useQuery({
    queryKey: ['cars', search],
    queryFn: () => getCars({
      search: search
    }),
    refetchOnWindowFocus: false
  })

  return (
    <div className="py-10 min-h-screen">
      <Container>
        <div>
          <h1 className="text-2xl font-bold mb-4">Cars</h1>
          <div className="card bg-base-100">
            <div className="card-body">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input 
                    placeholder="Search car..."
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
                <div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate("/admin/cars/create")}
                  >
                    <Plus size={18} />
                    Add new car
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto mt-3">
                <table className="table table-zebra table-md">
                  {/* head */}
                  <thead>
                    <tr>
                      <th>Name</th>
                      {/* <th>Brand</th>
                      <th>Model</th>
                      <th>Year</th>
                      <th>Color</th> */}
                      <th>Transmission</th>
                      <th>Fuel Type</th>
                      <th>Seat Count</th>
                      <th>Door Count</th>
                      <th>SelfDrive Rate</th>
                      <th>With Driver</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.rows.map((d, i) => (
                      <tr key={d.id}>
                        <td>{d?.make} - {d?.model} {d?.year} ({d?.color})</td>
                        {/* <td>{d?.make}</td>
                        <td>{d?.model}</td>
                        <td>{d?.year}</td>
                        <td>{d?.color}</td> */}
                        <td className="capitalize">{d?.transmission.replace("_", "-")}</td>
                        <td className="capitalize">{d?.fuelType}</td>
                        <td>{d?.seatCount}</td>
                        <td>{d?.doorCount}</td>
                        <td>₱{d?.dailyPrice.toLocaleString('en-US')}</td>
                        <td>₱{d?.withDriverDailyPrice.toLocaleString('en-US')}</td>
                        <td>
                          <button className="btn btn-ghost btn-sm">
                            <Eye size={14} />
                            View
                          </button>
                          <button className="btn text-primary btn-ghost btn-sm">
                            <SquarePen size={14} />
                            Edit
                          </button>
                          <button className="btn text-error btn-ghost btn-sm">
                            <Trash2 size={14} />
                            Delete
                          </button>
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
