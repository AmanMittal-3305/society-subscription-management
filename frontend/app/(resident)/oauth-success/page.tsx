
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OAuthSuccess() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get("token");
    if (!token) return;

    localStorage.removeItem("token");
    localStorage.removeItem("role");

    localStorage.setItem("token", token);

    const payload = JSON.parse(atob(token.split(".")[1]));
    localStorage.setItem("role", payload.role);

    router.replace(
      payload.role === "RESIDENT"
        ? "/dashboard"
        : "/admin/dashboard"
    );
  }, [params, router]);

  return <div>Logging in...</div>;
}

