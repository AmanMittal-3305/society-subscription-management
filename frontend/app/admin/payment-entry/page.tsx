"use client"

import { useEffect, useState } from "react"
import { Calendar, Wallet, CheckCircle, CreditCard, Banknote, ChevronDown } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { getPaymentEntryRecords, submitPaymentEntry } from "@/services/adminApi"

const paymentModes = [
  { value: "CASH", label: "Cash", icon: Banknote },
  { value: "UPI", label: "UPI", icon: Wallet },
  { value: "NEFT", label: "NEFT", icon: CreditCard },
  { value: "CHEQUE", label: "Cheque", icon: CreditCard },
]

export default function PaymentEntryPage() {
  const [records, setRecords] = useState<any[]>([])
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [month, setMonth] = useState(new Date())
  const [form, setForm] = useState({
    record_id: "",
    payment_mode: "CASH",
    payment_source: "OFFLINE",
    transaction_id: ""
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const fetchRecords = async () => {
    try {
      const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-01`
      const res = await getPaymentEntryRecords(monthStr)
      setRecords(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchRecords()
    setSelectedRecord(null)
    setForm({
      record_id: "",
      payment_mode: "CASH",
      payment_source: "OFFLINE",
      transaction_id: ""
    })
  }, [month])

  const handleFlatChange = (record_id: string) => {
    const record = records.find(r => r.record_id === record_id)
    setSelectedRecord(record)
    setForm({ ...form, record_id: record_id })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setError("")
    try {
      await submitPaymentEntry(form)
      setSuccess(true)
      setSelectedRecord(null)
      setForm({ record_id: "", payment_mode: "CASH", payment_source: "OFFLINE", transaction_id: "" })
      fetchRecords()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Payment failed")
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 min-h-screen bg-slate-50">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manual Payment Entry</h1>
        <p className="text-slate-500 mt-1">Record offline payments for pending subscriptions</p>
      </div>

      {/* Success Toast */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-2xl">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Payment recorded successfully!</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-600 px-5 py-4 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
        {/* Month Selector */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            Billing Month
          </label>
          <DatePicker
            selected={month}
            onChange={(date: Date | null) => {
              if (date) setMonth(date)
            }}
            dateFormat="MM/yyyy"
            showMonthYearPicker={true}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
          />
        </div>

        {/* Flat Selector */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Select Flat (Pending Only)</label>
          <div className="relative">
            <select
              required
              value={form.record_id}
              onChange={(e) => handleFlatChange(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-all"
            >
              <option value="">Choose a flat...</option>
              {records.map((r) => (
                <option key={r.record_id} value={r.record_id}>
                  Flat {r.flat_number} — {r.flat_type} — ₹{r.amount}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Amount Display */}
        {selectedRecord && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Amount Due</p>
              <p className="text-2xl font-bold text-indigo-900 mt-1">₹{parseFloat(selectedRecord.amount).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Flat</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{selectedRecord.flat_number}</p>
            </div>
          </div>
        )}

        {/* Payment Mode */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-3 block">Payment Mode</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {paymentModes.map((mode) => {
              const Icon = mode.icon
              const isSelected = form.payment_mode === mode.value
              return (
                <button
                  type="button"
                  key={mode.value}
                  onClick={() => setForm({ ...form, payment_mode: mode.value })}
                  className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border text-xs font-semibold transition-all ${isSelected
                    ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm"
                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {mode.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Transaction ID */}
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Transaction ID (optional)</label>
          <input
            type="text"
            value={form.transaction_id}
            onChange={(e) => setForm({ ...form, transaction_id: e.target.value })}
            placeholder="e.g. TXN12345678"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Wallet className="w-5 h-5" />
          Record Payment
        </button>
      </form>
    </div>
  )
}