"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { jsPDF } from "jspdf"
import {
  FileText,
  Download,
  IndianRupee,
  CheckCircle,
  Clock,
  CreditCard,
  Calendar,
  BarChart3
} from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { getMonthlyReport } from "@/services/adminApi"

export default function ReportsPage() {
  const [month, setMonth] = useState<Date>(new Date())
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchReport = async () => {
    try {
      setLoading(true)

      const formattedMonth = `${month.getFullYear()}-${String(
        month.getMonth() + 1
      ).padStart(2, "0")}-01`

      const res = await getMonthlyReport(formattedMonth)

      setReport(res.data)
    } catch (err) {
      console.log(err)
      setReport(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReport()
  }, [month])

  const downloadCSV = () => {
    if (!report) return

    const rows = [
      ["Month", report.month],
      ["Total Collection", report.total_collection],
      ["Pending Amount", report.pending_amount],
      ["Paid Flats", report.paid_flats],
      ["Pending Flats", report.pending_flats]
    ]

    report.payment_modes.forEach((m: any) => {
      rows.push([`Mode ${m.payment_mode}`, m.total])
    })

    const csv = rows.map((r: any) => r.join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `report-${report.month}.csv`
    a.click()
  }

  const downloadPDF = () => {
    if (!report) return

    const doc = new jsPDF()
    let y = 20

    doc.setFontSize(16)
    doc.text("Monthly Financial Report", 20, y)

    y += 15
    doc.setFontSize(12)

    doc.text(`Month: ${report.month}`, 20, y)
    y += 10

    doc.text(`Total Collection: Rs.${report.total_collection}`, 20, y)
    y += 10

    doc.text(`Pending Amount: Rs.${report.pending_amount}`, 20, y)
    y += 10

    doc.text(`Paid Flats: ${report.paid_flats}`, 20, y)
    y += 10

    doc.text(`Pending Flats: ${report.pending_flats}`, 20, y)
    y += 15

    doc.text("Payment Mode Breakdown:", 20, y)
    y += 10

    report.payment_modes.forEach((m: any) => {
      doc.text(`${m.payment_mode}: Rs.${m.total}`, 20, y)
      y += 10
    })

    doc.save(`report-${report.month}.pdf`)
  }

  const totalModeAmount =
    report?.payment_modes?.reduce(
      (sum: number, m: any) => sum + parseFloat(m.total || 0),
      0
    ) || 1

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-slate-50">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Financial Reports</h1>
          <p className="text-slate-500">Monthly financial summaries</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={downloadCSV}
            disabled={!report}
            className="bg-white border px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>

          <button
            onClick={downloadPDF}
            disabled={!report}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          Report Month
        </label>

        <DatePicker
          selected={month}
          onChange={(date: Date | null) => date && setMonth(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          className="w-full max-w-xs px-4 py-2 border rounded-xl bg-slate-50 cursor-pointer"
        />
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-10 w-10 border-b-2 border-indigo-600 rounded-full" />
        </div>
      )}

      {report && !loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Total Collection",
                value: `₹${parseFloat(report.total_collection || 0).toLocaleString()}`,
                icon: IndianRupee
              },
              {
                title: "Pending Amount",
                value: `₹${parseFloat(report.pending_amount || 0).toLocaleString()}`,
                icon: Clock
              },
              {
                title: "Paid Flats",
                value: report.paid_flats,
                icon: CheckCircle
              },
              {
                title: "Pending Flats",
                value: report.pending_flats,
                icon: Clock
              }
            ].map((val, i) => {
              const Icon = val.icon

              return (
                <div key={val.title} className="bg-white p-6 rounded-2xl shadow-sm">
                  <Icon className="w-5 h-5 mb-3 text-indigo-500" />
                  <p className="text-sm text-slate-500">{val.title}</p>
                  <p className="text-2xl font-bold">{val.value}</p>
                </div>
              )
            })}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" />
              Payment Mode Breakdown
            </h2>

            {report.payment_modes.map((m: any) => {
              const percentage = Math.round(
                (parseFloat(m.total) / totalModeAmount) * 100
              )

              return (
                <div key={m.payment_mode} className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>{m.payment_mode}</span>
                    <span>₹{parseFloat(m.total).toLocaleString()} ({percentage}%)</span>
                  </div>

                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="h-full bg-indigo-500"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

