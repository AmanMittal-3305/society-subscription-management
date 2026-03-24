"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Home,
    Building,
    CreditCard,
    CalendarDays,
    FileText,
    Bell,   
    Menu,
    Wallet
} from "lucide-react";
import SidebarContent from "./SidebarContent";

const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home },
    { name: "All Flats", href: "/admin/flats", icon: Building },
    { name: "Subscriptions", href: "/admin/subscription", icon: CreditCard },
    { name: "Monthly Records", href: "/admin/monthly-records", icon: CalendarDays },
    { name: "Payment Entry", href: "/admin/payment-entry", icon: Wallet },
    { name: "Reports", href: "/admin/report", icon: FileText },
    { name: "Notifications", href: "/admin/notification", icon: Bell },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.replace("/login");
    };

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-40 flex items-center justify-between px-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
                        S
                    </div>
                    <span className="text-white font-bold tracking-wide">Society<span className="text-indigo-400">Hub</span></span>
                </div>
                <button onClick={() => setIsOpen(true)} className="text-slate-300 hover:text-white p-2 transition-colors">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-72 bg-slate-900 min-h-screen text-slate-300 flex-col transition-all duration-300 border-r border-slate-800 shrink-0 sticky top-0 h-screen">
                <SidebarContent
                    navItems={navItems}
                    pathname={pathname}
                    profileHref="/admin/profile"
                    profileLabel="Admin Profile"
                    onLogout={handleLogout}
                    layoutId="adminActiveTab"
                    setIsOpen={setIsOpen}
                />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <div>
                {isOpen && (
                    <>
                        <div onClick={() => setIsOpen(false)} className="lg:hidden fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50" />
                        <aside className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-slate-900 text-slate-300 flex flex-col z-50 shadow-2xl">
                            <SidebarContent
                                navItems={navItems}
                                pathname={pathname}
                                profileHref="/admin/profile"
                                profileLabel="Admin Profile"
                                onLogout={handleLogout}
                                layoutId="adminActiveTab"
                                setIsOpen={setIsOpen}
                            />
                        </aside>
                    </>
                )}
            </div>
        </>
    );
}
