"use client"

import Link from "next/link"

export default function LoginLayout({
  children,
  active
}: {
  children: React.ReactNode
  active: "USER" | "ADMIN"
}) {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-xl w-[1100px] grid grid-cols-2 overflow-hidden">

        {/* Left Image */}
        <div>
          <img
            src="https://www.manglamgroup.com/wp-content/uploads/2024/01/swimmingpool-Corner-Night_cc.jpg"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Form Section */}
        <div className="p-10">

          {/* Toggle Buttons */}
          <div className="flex mb-6 bg-gray-200 rounded-lg p-1">

            <Link
              href="/"
              className={`flex-1 text-center py-2 rounded-md ${
                active === "USER" ? "bg-white shadow" : ""
              }`}
            >
              Resident Login
            </Link>

            <Link
              href="/admin/login"
              className={`flex-1 text-center py-2 rounded-md ${
                active === "ADMIN" ? "bg-white shadow" : ""
              }`}
            >
              Admin Login
            </Link>

          </div>

          {children}

        </div>

      </div>

    </div>
  )
}