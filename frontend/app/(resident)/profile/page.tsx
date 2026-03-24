"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, ShieldCheck, MapPin, Building, Edit2 } from "lucide-react";
import Link from "next/link";
import { getResidentProfile } from "@/services/residentApi";

export default function ResidentProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getResidentProfile();
        setUser(res.data.user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="text-slate-500 font-medium">Failed to load profile. Please log in again.</div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    if (!name) return "A";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const personalInfo = [
    { label: "Full Name", value: user.full_name, icon: User },
    { label: "Email Address", value: user.email, icon: Mail },
    { label: "Phone Number", value: user.phone_number || "Not provided", icon: Phone },
  ];

  const adminInfo = [
    { label: "Role", value: user.role, icon: ShieldCheck, highlight: true},
  ];



  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Background */}
      <div className="h-64 sm:h-80 w-full bg-blue-900 relative overflow-hidden">
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-12">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          {/* Profile Header Section */}
          <div className="p-8 sm:p-10 border-b border-slate-100 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-blue-900 flex items-center justify-center text-white text-5xl sm:text-6xl font-bold shadow-xl border-4 border-white">
                {getInitials(user.full_name)}
              </div>
            </div>

            <div className="flex flex-col text-center sm:text-left flex-1 mb-2">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
                {user.full_name}
              </h1>
              <p className="text-indigo-600 font-medium flex items-center justify-center sm:justify-start gap-1.5 mt-1 sm:mt-2 text-sm sm:text-base uppercase">
              </p>
            </div>

            <div className="mb-2">
              <button className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors shadow-lg shadow-slate-900/20 active:scale-95 flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                <Link href={`/profile/${user.user_id}`}>Edit Profile</Link>
              </button>
            </div>
          </div>

          {/* Profile Details Sections */}
          <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                Personal Information
              </h3>
              <div className="space-y-4">
                {personalInfo.map((info, idx) => {
                  const Icon = info.icon;
                  return (
                    <div key={idx} className="group p-4 bg-slate-50 hover:bg-slate-200/50 rounded-2xl border border-slate-100 hover:border-slate-300 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 text-slate-600">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase">{info.label}</p>
                        <p className="text-sm font-bold text-slate-900 mt-0.5">{info.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Admin Details */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-500" />
                Administrative Details
              </h3>
              <div className="space-y-4">
                {adminInfo.map((info, idx) => {
                  const Icon = info.icon;
                  return (
                    <div key={idx} className="group p-4 bg-slate-50 hover:bg-emerald-100/50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 text-slate-400 transition-colors shadow-sm">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{info.label}</p>
                          <p className={`text-sm font-bold mt-0.5 ${info.highlight ? 'text-emerald-600 uppercase tracking-wide' : 'text-slate-900'}`}>{info.value}</p>
                        </div>
                      </div>
                      
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}