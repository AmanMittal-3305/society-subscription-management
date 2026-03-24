"use client";

import AdminSidebar from "@/components/AdminSidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        const role = localStorage.getItem("role");

        if (role !== "ADMIN") {
            router.push("/login");
        }
    }, [router]);

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans">
            <AdminSidebar />
            <main className="flex-1 w-full max-h-screen overflow-y-auto pt-16 lg:pt-0">
                {children}
            </main>
        </div>
    );
}