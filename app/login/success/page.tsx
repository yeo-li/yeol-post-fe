'use client'

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginSuccess() {
    useEffect(() => {
        useAuth().login()
        const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        window.location.href = redirectUrl;
    }, []);

    return <div>로그인 중입니다...</div>;
}