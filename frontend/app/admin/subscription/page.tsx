"use client"

import { useEffect, useState } from "react"
import { CreditCard, Plus, Edit2, Trash2, X, Save, IndianRupee } from "lucide-react"
import {
  getSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from "@/services/adminApi"

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [flatType, setFlatType] = useState("1BHK")
  const [monthlyRate, setMonthlyRate] = useState("")
  const [editId, setEditId] = useState<string | null>(null)
  const [editRate, setEditRate] = useState("")

  const fetchPlans = async () => {
    const res = await getSubscriptions()
    setPlans(res.data)
  }

  useEffect(() => { fetchPlans() }, [])

  const handleCreate = async () => {
    await createSubscription({ flat_type: flatType, monthly_rate: monthlyRate })
    setFlatType("1BHK")
    setMonthlyRate("")
    setShowModal(false)
    fetchPlans()
  }

  const handleDelete = async (id: string) => {
    await deleteSubscription(id)
    fetchPlans()
  }

  const handleUpdate = async () => {
    if (!editId) return
    await updateSubscription(editId, { monthly_rate: editRate })
    setEditId(null)
    setEditRate("")
    fetchPlans()
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Subscription Plans</h1>
          <p className="text-slate-500 mt-1">Manage monthly subscription rates by flat type</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold transition-colors shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Plan
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {plans.map((plan, i) => {
          const isEditing = editId === plan.plan_id

          return (
            <div key={plan.plan_id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all hover:-translate-y-0.5">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border uppercase tracking-wider`}>
                    {plan.flat_type}
                  </span>
                  <CreditCard className="w-5 h-5 text-slate-300" />
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-lg font-bold"
                        value={editRate}
                        onChange={(e) => setEditRate(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        onClick={handleUpdate}
                      >
                        <Save className="w-3.5 h-3.5" />
                        Save
                      </button>
                      <button
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-slate-500 font-medium">Monthly Rate</p>

                      <p className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">
                        ₹{parseFloat(plan.current_rate).toLocaleString()}
                        <span className="text-sm font-normal text-slate-400">/month</span>
                      </p>

                      <p className="text-sm text-slate-500 mt-2">
                        From next month:{" "}
                        <span className="font-semibold text-indigo-600">
                          ₹{parseFloat(plan.next_rate).toLocaleString()}
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="flex-1 bg-slate-100 hover:bg-amber-50 hover:text-amber-600 text-slate-600 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        onClick={() => {
                          setEditId(plan.plan_id)
                          setEditRate(plan.current_rate)
                        }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        className="flex-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                        onClick={() => handleDelete(plan.plan_id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-20 text-slate-400">
          <CreditCard className="w-12 h-12 mx-auto mb-4 text-slate-200" />
          <p className="font-medium">No subscription plans yet</p>
          <p className="text-sm mt-1">Create your first plan to get started</p>
        </div>
      )}

      {/*Plan Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-8 w-[420px] max-w-[95vw] border border-slate-100"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 mb-6">Create New Plan</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Flat Type</label>
                <select
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  value={flatType}
                  onChange={(e) => setFlatType(e.target.value)}
                >
                  <option>1BHK</option>
                  <option>2BHK</option>
                  <option>3BHK</option>
                  <option>4BHK</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Monthly Rate (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="e.g. 5000"
                    value={monthlyRate}
                    onChange={(e) => setMonthlyRate(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={handleCreate}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}