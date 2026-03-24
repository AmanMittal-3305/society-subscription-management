import Link from "next/link"
import AdminLoginPage from "@/components/AdminLoginPage"

export default function Page() {
  return (
    <>
      <div className="flex mb-6 bg-slate-100 rounded-xl p-1">
        <Link
          href="/login"
          className="flex-1 text-center py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 transition-all"
        >
          Resident
        </Link>
        <Link
          href="/admin/login"
          className="flex-1 text-center py-2.5 bg-white shadow-sm rounded-lg text-sm font-semibold text-slate-900 transition-all"
        >
          Admin
        </Link>
      </div>
      <AdminLoginPage />
    </>
  )
}