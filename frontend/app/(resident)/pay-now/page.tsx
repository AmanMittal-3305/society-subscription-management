"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getPendingPayments } from "@/services/residentApi";

export default function PayNowList() {
    const [records, setRecords] = useState<any[]>([]);

    useEffect(() => {
        getPendingPayments()
            .then(res => setRecords(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-xl font-bold mb-4">Pending Payments</h1>
            <ul className="space-y-2">
                {!records.length ? (
                    <div className="text-center py-20 text-slate-400">
                        <p>No pending payments</p>
                    </div>
                ) : (
                    records.map(record => (
                        <li key={record.record_id} className="flex justify-between items-center p-4 border rounded-lg">
                            <span>Record ID: {record.record_id}</span>
                            <span>Amount: {record.amount}</span>
                            <span>Month: {record.month}</span>
                            <span>Year: {record.year}</span>
                            <Link
                                href={`/pay-now/${record.record_id}`}
                                className="bg-black text-white px-4 py-2 rounded-lg"
                            >
                                Pay Now
                            </Link>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}