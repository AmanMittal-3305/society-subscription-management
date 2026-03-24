"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import {
    Home,
    CreditCard,
    Wallet,
    Menu,
    Bell,
} from "lucide-react";
import SidebarContent from "./SidebarContent";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
    { name: "Pay Now", href: "/pay-now", icon: Wallet },
    { name: "Notifications", href: "/notification", icon: Bell }
];

export default function ResidentSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        fetchUnread();
    }, []);

    const fetchUnread = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(`${API}/api/resident/notifications/unread`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setHasUnread(res.data.unread > 0);

        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.replace("/login");
    };

    return (
        <>
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-40 flex items-center justify-between px-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold">
                        S
                    </div>
                    <span className="text-white font-bold tracking-wide">
                        Society<span className="text-indigo-400">Hub</span>
                    </span>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="text-slate-300 hover:text-white p-2 transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            <aside className="hidden lg:flex w-72 bg-slate-900 min-h-screen text-slate-300 flex-col border-r border-slate-800 shrink-0 sticky top-0 h-screen">
                <SidebarContent
                    navItems={navItems}
                    pathname={pathname}
                    profileHref="/profile"
                    profileLabel="Profile"
                    onLogout={handleLogout}
                    layoutId="residentActiveTab"
                    setIsOpen={setIsOpen}
                />
            </aside>

            <div>
                {isOpen && (
                    <>
                        <div onClick={() => setIsOpen(false)} className="lg:hidden fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50" />

                        <aside className="lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-slate-900 text-slate-300 flex flex-col z-50 shadow-2xl">
                            <SidebarContent
                                navItems={navItems}
                                pathname={pathname}
                                profileHref="/profile"
                                profileLabel="Profile"
                                onLogout={handleLogout}
                                layoutId="residentActiveTab"
                                setIsOpen={setIsOpen}
                            />
                        </aside>
                    </>
                )}
            </div>
        </>
    );
}