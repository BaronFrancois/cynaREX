"use client";

import Cookies from "js-cookie";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AccountDashboard from "@/components/AccountDashboard";

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("auth_token");
        if (!token) {
            router.replace("/auth/login");
        }
    }, [router]);

    return <AccountDashboard />;
}
