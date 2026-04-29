"use client";

import Cookies from "js-cookie";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AccountDashboard from "@/components/AccountDashboard";

export default function Account() {
    const router = useRouter();

    useEffect(() => {
        const auth_token = Cookies.get("auth_token");
        if (!auth_token) {
            router.replace("/auth/login");
        }
    }, [router]);

    return <AccountDashboard />;
}
