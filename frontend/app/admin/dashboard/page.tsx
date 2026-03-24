"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getAdminDashboard } from "@/services/adminApi";

import { Building2, Users, IndianRupee, AlertTriangle, Activity, CreditCard } from "lucide-react";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function DashboardPage() {
    const [data, setData] = useState({
        total_flats: 0,
        total_residents: 0,
        total_collected: 0,
        total_pending: 0,
        recent_transactions: [],
        revenue_analytics: {
            months: [] as string[],
            amounts: [] as number[]
        }
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await getAdminDashboard();

                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatCurrency = (amount: number) => {
        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)}L`;
        } else if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(1)}K`;
        }
        return `₹${amount}`;
    };

    const stats = [
        {
            name: "Total Flats",
            value: data.total_flats.toString(),
            icon: Building2,
        },
        {
            name: "Active Residents",
            value: data.total_residents.toString(),
            icon: Users,
        },
        {
            name: "Revenue Collected",
            value: formatCurrency(data.total_collected),
            icon: IndianRupee,
        },
        {
            name: "Pending Dues",
            value: formatCurrency(data.total_pending),
            icon: AlertTriangle,
        }
    ];

    const allMonths = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const backendMonths = data.revenue_analytics.months;
    const backendAmounts = data.revenue_analytics.amounts;

    const chartData = allMonths.map((month) => {
        const index = backendMonths.indexOf(month);
        return {
            month,
            amount: index !== -1 ? backendAmounts[index] : 0
        };
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                        Dashboard Overview
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Welcome back. Here's your society data today.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;

                        return (
                            <div key={stat.name} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                                    <Icon className="w-5 h-5 text-blue-600" />
                                </div>

                                <p className="text-sm text-slate-500">{stat.name}</p>
                                <h3 className="text-2xl font-semibold text-slate-900 mt-1">
                                    {stat.value}
                                </h3>
                            </div>
                        );
                    })}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* Chart */}
                    <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Activity className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-semibold text-slate-900">
                                Revenue Analytics
                            </h2>
                        </div>

                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="2 2" vertical={false} />
                                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} />
                                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                                <Bar
                                    dataKey="amount"
                                    fill="#2563eb"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Recent Entries
                                </h2>
                            </div>

                            <Link
                                href="/admin/monthly-records"
                                className="text-sm font-medium text-blue-600"
                            >
                                View All
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {data.recent_transactions.map((tx: any) => (
                                <div
                                    key={tx.id}
                                    className="flex justify-between items-center py-3 border-b border-slate-100 last:border-none"
                                >
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            Flat {tx.flat}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {new Date(tx.date).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-medium text-slate-900">
                                            ₹{parseFloat(tx.amount).toLocaleString()}
                                        </p>
                                        <span
                                            className={`text-xs font-medium py-1 rounded-md ${tx.status === "PAID"
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-amber-50 text-amber-600"
                                                }`}
                                        >
                                            {tx.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}