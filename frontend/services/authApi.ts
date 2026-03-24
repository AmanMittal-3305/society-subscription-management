import api from "./api";

// ─── Login ──────────────────────────────────────────
export const loginUser = (data: { email: string; password: string; role: string }) =>
    api.post("/api/auth/login", data);

// ─── Register ───────────────────────────────────────
export const registerUser = (data: {
    email: string;
    password: string;
    full_name: string;
    phone_number: string;
    role: string;
}) => api.post("/api/auth/register", data);
