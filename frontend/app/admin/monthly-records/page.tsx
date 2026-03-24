"use client"

import { useState, useEffect } from "react"
import { Calendar, Search, CheckCircle, Clock, FileText } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { getMonthlyRecords, markRecordPaid } from "@/services/adminApi"

export default function MonthlyRecordsPage() {
  const [records, setRecords] = useState<any[]>([])
  const [month, setMonth] = useState(new Date())

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchRecords = async () => {
    try {
      const res = await getMonthlyRecords(month, page)
      setRecords(res.data.records)
setTotalPages(res.data.totalPages || 1)
    } catch (err) {
      console.error("Error fetching records:", err)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [page])

  const handleMarkPaid = async (record_id: string) => {
    try {
      await markRecordPaid(record_id)
      fetchRecords()
    } catch (err) {
      console.error("Error marking paid:", err)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-slate-50">
      <h1 className="text-3xl font-bold text-slate-900">Monthly Records</h1>

      <div className="bg-white p-6 rounded-2xl border shadow-sm flex gap-4 items-end">
        <div className="flex-1">
          <label className="block mb-2 text-sm font-medium text-slate-700">Select Month</label>
          <DatePicker selected={month} onChange={(date: Date | null) => {
            if (date) {
              setMonth(date)
            }
            setPage(1)
          }}
            dateFormat="MM/yyyy"
            showMonthYearPicker
            className="mt-1 cursor-pointer w-full p-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"

          />
        </div>
        <button
          onClick={fetchRecords}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Load Records
        </button>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-slate-500 font-medium border-b">
            <tr>
              <th className="px-6 py-4">Flat No</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-8 h-8 text-slate-200" />
                    <p>No records found for the selected month.</p>
                  </div>
                </td>
              </tr>
            ) : (
              records.map((r) => (
                <tr key={r.record_id} className="hover:bg-slate-50/80">
                  <td className="px-6 py-4 font-bold">{r.flat_number}</td>
                  <td className="px-6 py-4">{r.flat_type}</td>
                  <td className="px-6 py-4">₹{r.amount}</td>
                  <td className="px-6 py-4">
                    {r.status === "PAID" ? (
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-xs font-bold uppercase">
                        <CheckCircle className="w-3.5 h-3.5" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-600 px-2.5 py-1 rounded-lg text-xs font-bold uppercase">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {r.status === "PENDING" ? (
                      <button onClick={() => handleMarkPaid(r.record_id)} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold">
                        Mark Paid
                      </button>
                    ) : (
                      <span className="text-slate-300 text-xs">No Action</span>
                    )}
                  </td>
                </tr>
              ))
            )}
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
    </div>
  )
}