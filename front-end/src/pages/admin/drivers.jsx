import React, { useState } from "react";
import Container from "../../components/Container";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getCars } from "../../rest/admin/car";
import { Ellipsis, Eye, Plus, SquarePen, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import api from "../../lib/api";

export default function AdminDriversPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [form, setForm] = useState({
    name: "",
    licenseId: "",
    licenseExpire: "",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["drivers", search],
    queryFn: async () =>
      (await api.get(`/admin/driver`, { params: { search } })).data,
    refetchOnWindowFocus: false,
  });

  const { mutate } = useMutation({
    mutationFn: async () => (await api.post("/admin/driver", form)).data,
    onSuccess: (data) => {
      refetch();
      document.getElementById("create_driver_modal")?.close();
      setForm({
        name: "",
        licenseId: "",
        licenseExpire: "",
      });
    },
  });

  return (
    <div className="py-10 min-h-screen">
      <dialog id="create_driver_modal" className="modal">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate();
          }}
          className="modal-box w-full max-w-lg"
        >
          <h3 className="font-bold text-lg">Create Driver</h3>
          <div>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Name</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Type here"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">License Number</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Type here"
                required
                value={form.licenseId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, licenseId: e.target.value }))
                }
              />
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                License Expiration Date
              </legend>
              <input
                type="date"
                className="input w-full"
                required
                value={
                  form.licenseExpire
                    ? dayjs(form.licenseExpire).format("YYYY-MM-DD")
                    : ""
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    licenseExpire: dayjs(e.target.value).toISOString(),
                  }))
                }
              />
            </fieldset>
          </div>
          <div className="modal-action">
            <button onClick={() => document.getElementById('create_driver_modal').close()} type="button" className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <Container>
        <div>
          <h1 className="text-2xl font-bold mb-4">Drivers</h1>
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
                      const val = e.target.value;
                      setSearchText(val);
                      if (!val) setSearch(val);
                    }}
                  />
                  <button className="btn" onClick={() => setSearch(searchText)}>
                    Search
                  </button>
                </div>
                <div>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      document
                        .getElementById("create_driver_modal")
                        ?.showModal()
                    }
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
                      <th>License Number</th>
                      <th>Expiration Date</th>
                      <th>Created At</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.rows.map((d, i) => (
                      <tr key={d.id}>
                        <td>{d?.name}</td>
                        <td>{d?.licenseId}</td>
                        <td>{d?.licenseExpire}</td>
                        <td>{dayjs(d?.createdAt).format("MMM DD, YYYY")}</td>
                        <td>
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
