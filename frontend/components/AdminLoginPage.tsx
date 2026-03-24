"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react"
import { loginUser } from "@/services/authApi"

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const role = "ADMIN"

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await loginUser({ email, password, role })

      if (res.data.success) {
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("role", res.data.role)
        router.replace("/admin/dashboard")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span className="text-xs font-bold text-indigo-600 uppercase">Admin Portal</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Admin Sign In</h2>
        <p className="text-slate-500 text-sm mt-1">Access the society management dashboard</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm" />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* <button
        type="button"
        onClick={() =>
          window.location.href = "http://localhost:5000/api/auth/google"
        }
        className="w-full bg-blue-500 text-white py-3.5 rounded-xl font-semibold cursor-pointer"
      >
        Login with Google
      </button> */}


      <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white py-3.5 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-slate-900/25 hover:shadow-slate-900/40 active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-60">
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Access Dashboard
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>


    </form>
  )
}