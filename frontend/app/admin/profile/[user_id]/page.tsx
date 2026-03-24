"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminProfile, updateAdminProfile } from "@/services/adminApi";

export default function ResidentProfileUpdate() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await getAdminProfile();
            setData(res.data.user || res.data);
            setFormData({
                name: res.data.user?.full_name || "",
                email: res.data.user?.email || "",
                phone: res.data.user?.phone_number || "",
                password: "",
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await updateAdminProfile(formData);
            console.log(res.data);
            alert("Profile updated successfully!");
            router.push("/admin/profile");
        } catch (err) {
            console.error(err);
            alert("Failed to update profile.");
        }
    };

    if (!data) return <div>Loading...</div>;

    return (
        <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow mt-10">
            <h1 className="text-xl font-bold mb-4">Update Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label>Password (leave blank to keep unchanged)</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg"
                >
                    Update Profile
                </button>
            </form>
        </div>
    );
}