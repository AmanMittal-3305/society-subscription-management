"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/services/authApi";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const role = "ADMIN"
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const res = await registerUser({
        email,
        password,
        full_name: fullName,
        phone_number: phone,
        role,
      });

      if (res.data.success) {
        alert("Registered successfully. Please login.");
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center text-black items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl mb-4">Register</h2>

        <label className="block mb-1">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="border p-2 w-full mb-3"
          required
        />

        <label className="block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 w-full mb-3"
          required
        />

        <label className="block mb-1">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="border p-2 w-full mb-3"
          required
        />

        <label className="block mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 w-full mb-3"
          required
        />



        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div>
          <Link href={"/admin/login"}> Already registered !! Login</Link>
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded w-full"
        >
          Register
        </button>
      </form>
    </div>
  );
}