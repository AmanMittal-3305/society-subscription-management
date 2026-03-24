"use client"

import { useEffect, useState } from "react"
import { Plus, Edit2, Trash2, Undo } from "lucide-react"
import {
  getFlats,
  createFlat,
  updateFlat,
  deleteFlat as deleteFlatApi,
  restoreFlat as restoreFlatApi,
  getAvailableResidents,
  assignResident,
  registerResidentToFlat
} from "@/services/adminApi"

export default function FlatsPage() {
  const [flats, setFlats] = useState<any[]>([])
  const [search, setSearch] = useState("")

  const [flatNumber, setFlatNumber] = useState("")
  const [flatType, setFlatType] = useState("1BHK")
  const [address, setAddress] = useState("")

  const [ownerDetails, setOwnerDetails] = useState({
    owner_name: "",
    owner_email: "",
    owner_phone: "",
    assign_flat_itself: false
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [showResidentModal, setShowResidentModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const [selectedFlat, setSelectedFlat] = useState("")
  const [residents, setResidents] = useState<any[]>([])
  const [selectedResident, setSelectedResident] = useState("")

  const [newResidentName, setNewResidentName] = useState("")
  const [newResidentEmail, setNewResidentEmail] = useState("")
  const [newResidentPhone, setNewResidentPhone] = useState("")

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchFlats = async () => {
    try {
      const res = await getFlats(page, 5, search)

      setFlats(res.data.flats || [])
      setTotalPages(res.data.totalPages || 1)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchResidents = async () => {
    try {
      const res = await getAvailableResidents()
      setResidents(res.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchFlats()
  }, [page, search])

  const resetForm = () => {
    setFlatNumber("")
    setFlatType("1BHK")
    setAddress("")
    setOwnerDetails({
      owner_name: "",
      owner_email: "",
      owner_phone: "",
      assign_flat_itself: false
    })
    setEditingId(null)
    setShowForm(false)
  }

  const saveFlat = async () => {
    try {
      const data = {
        flat_number: flatNumber,
        flat_type: flatType,
        address,
        owner_name: ownerDetails.owner_name,
        owner_email: ownerDetails.owner_email,
        owner_phone: ownerDetails.owner_phone,
        assign_flat_itself: ownerDetails.assign_flat_itself
      }

      if (editingId) {
        await updateFlat(editingId, data)
      } else {
        await createFlat(data)
      }

      resetForm()
      fetchFlats()
    } catch (err) {
      console.error(err)
    }
  }

  const handleEdit = (flat: any) => {
  setEditingId(flat.flat_id)
  setFlatNumber(flat.flat_number)
  setFlatType(flat.flat_type)
  setAddress(flat.address)

  setOwnerDetails({
    owner_name: flat.owner_name || "",
    owner_email: flat.owner_email || "",
    owner_phone: flat.owner_phone || "",
    assign_flat_itself: false
  })

  setShowForm(true)
}

  const handleDelete = async (id: string) => {
    await deleteFlatApi(id)
    fetchFlats()
  }

  const handleRestore = async (id: string) => {
    await restoreFlatApi(id)
    fetchFlats()
  }

  const openResidentModal = async (flatId: string) => {
    setSelectedFlat(flatId)
    setSelectedResident("")
    await fetchResidents()
    setShowResidentModal(true)
  }

  const handleAssignResident = async () => {
    try {
      await assignResident(selectedFlat, selectedResident)
      setShowResidentModal(false)
      fetchFlats()
    } catch (err) {
      console.error(err)
    }
  }

  const handleRegisterResident = async () => {
    try {
      await registerResidentToFlat(selectedFlat, {
        full_name: newResidentName,
        email: newResidentEmail,
        phone_number: newResidentPhone
      })

      setNewResidentName("")
      setNewResidentEmail("")
      setNewResidentPhone("")

      setShowRegisterModal(false)
      fetchFlats()
    } catch (err) {
      console.error(err)
    }
  }

  // const filteredFla = flats.filter((flat) =>
  //   flat.flat_number?.toLowerCase().includes(search.toLowerCase())
  // )

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-slate-50">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Flats Management</h1>

        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2 rounded-xl flex gap-2 items-center shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Flat
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl shadow-md border space-y-5">
          <div className="grid grid-cols-4 gap-4">

            <input
              className="border border-slate-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Flat Number"
              value={flatNumber}
              onChange={(e) => setFlatNumber(e.target.value)}
            />

            <select
              className="border p-2 rounded"
              value={flatType}
              onChange={(e) => setFlatType(e.target.value)}
            >
              <option>1BHK</option>
              <option>2BHK</option>
              <option>3BHK</option>
              <option>4BHK</option>
            </select>

            <input
              className="border p-2 rounded"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">

            <input
              className="border p-2 rounded"
              placeholder="Owner Name"
              value={ownerDetails.owner_name}
              onChange={(e) =>
                setOwnerDetails({ ...ownerDetails, owner_name: e.target.value })
              }
            />

            <input
              className="border p-2 rounded"
              placeholder="Owner Email"
              value={ownerDetails.owner_email}
              onChange={(e) =>
                setOwnerDetails({ ...ownerDetails, owner_email: e.target.value })
              }
            />

            <input
              className="border p-2 rounded"
              placeholder="Owner Phone"
              value={ownerDetails.owner_phone}
              onChange={(e) =>
                setOwnerDetails({ ...ownerDetails, owner_phone: e.target.value })
              }
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={ownerDetails.assign_flat_itself}
              onChange={(e) =>
                setOwnerDetails({
                  ...ownerDetails,
                  assign_flat_itself: e.target.checked
                })
              }
            />
            Owner lives in this flat
          </label>

          <div className="flex gap-3">
            <button onClick={saveFlat} className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-5 py-2 rounded-lg shadow-sm">
              Save
            </button>

            <button onClick={resetForm} className="px-5 py-2 border rounded-lg hover:bg-slate-100 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      <input
        className="border border-slate-300 p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none bg-white shadow-sm"
        placeholder="Search flat"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(1)
        }}
      />

      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
  <table className="w-full">

    <thead>
      <tr className="bg-slate-100 text-slate-700">
        <th className="p-4 text-left font-semibold">Flat</th>
        <th className="p-4 text-left font-semibold">Owner</th>
        <th className="p-4 text-left font-semibold">Resident</th>
        <th className="p-4 text-left font-semibold">Type</th>
        <th className="p-4 text-left font-semibold">Address</th>
        <th className="p-4 text-left font-semibold">Actions</th>
      </tr>
    </thead>

    <tbody>
      {flats.map((flat) => (
        <tr
          key={flat.flat_id}
          className={`border-t border-slate-100 hover:bg-slate-50 transition-all duration-200 ${
            !flat.is_active ? "text-gray-400 bg-gray-50" : ""
          }`}
        >

          <td className="p-4 font-medium text-slate-800">
            {flat.flat_number}
          </td>

          <td className="p-4">
            {flat.owner_name}
          </td>

          <td className="p-4">
            {flat.resident_name ? (
              flat.resident_name
            ) : (
              <button
                onClick={() => openResidentModal(flat.flat_id)}
                className={`text-indigo-600 font-medium hover:text-indigo-800 transition ${
                  !flat.is_active ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                Add Resident
              </button>
            )}
          </td>

          <td className="p-4">
            <span className="px-3 py-1 rounded-full bg-slate-100 text-sm font-medium">
              {flat.flat_type}
            </span>
          </td>

          <td className="p-4 text-slate-600">
            {flat.address}
          </td>

          <td className="p-4">
            <div className="flex gap-2">

              <button
                onClick={() => handleEdit(flat)}
                disabled={!flat.is_active}
                className={`p-2 rounded-lg transition hover:bg-indigo-50 ${
                  !flat.is_active ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                <Edit2 className="w-4 h-4 text-indigo-600" />
              </button>

              {flat.is_active ? (
                <button
                  onClick={() => handleDelete(flat.flat_id)}
                  className="p-2 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              ) : (
                <button
                  onClick={() => handleRestore(flat.flat_id)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 transition text-gray-500"
                >
                  <Undo className="w-4 h-4" />
                  <span className="text-sm">Undo</span>
                </button>
              )}

            </div>
          </td>

        </tr>
      ))}
    </tbody>

  </table>
</div>

      <div className="flex justify-center gap-4 mt-6">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer"
        >
          Previous
        </button>

        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>

      </div>

      {showResidentModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl w-[400px] space-y-4 shadow-xl">

            <h2 className="text-xl font-bold">Add Resident</h2>

            <select
              className="w-full border p-2 rounded"
              value={selectedResident}
              onChange={(e) => setSelectedResident(e.target.value)}
            >
              <option value="">Select Existing Resident</option>

              {residents.map((r) => (
                <option key={r.user_id} value={r.user_id}>
                  {r.full_name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAssignResident}
              className="w-full bg-indigo-600 text-white py-2 rounded"
            >
              Assign Existing Resident
            </button>

            <button
              onClick={() => {
                setShowResidentModal(false)
                setShowRegisterModal(true)
              }}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              + Add New Resident
            </button>

            <button
              onClick={() => setShowResidentModal(false)}
              className="w-full border py-2 rounded"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">

            <input
              placeholder="Full Name"
              className="w-full border p-2 rounded"
              value={newResidentName}
              onChange={(e) => setNewResidentName(e.target.value)}
            />

            <input
              placeholder="Email"
              className="w-full border p-2 rounded"
              value={newResidentEmail}
              onChange={(e) => setNewResidentEmail(e.target.value)}
            />

            <input
              placeholder="Phone"
              className="w-full border p-2 rounded"
              value={newResidentPhone}
              onChange={(e) => setNewResidentPhone(e.target.value)}
            />

            <button
              onClick={handleRegisterResident}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Register Resident
            </button>

            <button
              onClick={() => setShowRegisterModal(false)}
              className="w-full border py-2 rounded"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  )
}