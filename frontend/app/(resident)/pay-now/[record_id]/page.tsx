"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { savePayment } from "@/services/residentApi";

export default function PayNowPage() {
    const params = useParams();
    const router = useRouter();

    const recordId = params.record_id as string;

    const [paymentMode, setPaymentMode] = useState("ONLINE");
    const [message, setMessage] = useState("");

    const handlePayment = async () => {
        try {
            const res = await savePayment({
                record_id: recordId,
                payment_mode: paymentMode,
                transaction_id: ""
            });

            setMessage(res.data.message);

            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);

        } catch (err: any) {
            setMessage(err.response?.data?.message || "Payment failed");
        }
    };

    return (
        <div className="p-8 max-w-md mx-auto bg-white rounded-2xl shadow mt-10">
            <h1 className="text-xl font-bold mb-4">Pay Subscription</h1>

            <p className="mb-4 text-sm text-gray-500">
                Record ID: {recordId}
            </p>

            <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mb-4"
            >
                <option value="UPI">UPI</option>
                <option value="ONLINE">ONLINE</option>
                <option value="NEFT">NEFT</option>
                <option value="CHEQUE">CHEQUE</option>
                <option value="CASH">CASH</option>
            </select>

            <button
                onClick={handlePayment}
                className="w-full bg-black text-white py-2 rounded-lg"
            >
                Confirm Payment
            </button>

            {message && (
                <p className="mt-4 text-center">{message}</p>
            )}
        </div>
    );
}