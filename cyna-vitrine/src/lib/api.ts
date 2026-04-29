import axios from "axios";
import { getAuthToken } from "@/lib/authCookie";
import { getApiBase } from "@/lib/publicApi";

export default function api() {
    const token = typeof document !== "undefined" ? getAuthToken() : undefined;

    return axios.create({
        baseURL: getApiBase(),
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
}
