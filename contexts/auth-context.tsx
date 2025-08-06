"use client"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import {fetchLoginInformation} from "../lib/api"
import Cookies from "js-cookie";

interface AuthContextType {
  isLoggedIn: boolean
  authChecked: boolean
  login: () => void
  logout: () => void
  updateLoginState: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  let [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  const login = async () => {
    console.log("login start")
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins/me`, { credentials: "include" });
    const data = await res.json()
    if (res.ok && data.isLoggedIn) {
      console.log("로그인 성공 확인됨");
      isLoggedIn = true;
    }
  }

  const logout = async () => {
    const csrfToken = Cookies.get("XSRF-TOKEN");

    console.log("전체 쿠키:", document.cookie);
    console.log("XSRF-TOKEN from js-cookie:", Cookies.get("XSRF-TOKEN"));

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": Cookies.get("XSRF-TOKEN") ?? ""
      }
    });

    console.log("Logout response:", res);

    if (res.ok) {
      // 로그아웃 성공
      window.location.reload();
    } else {
      console.error("로그아웃 실패", res.status);
    }
  };

  const updateLoginState = async () => {
    try{
      const res = await fetchLoginInformation();
      if (res?.isLoggedIn) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (e) {
      console.error("로그인 상태 확인 실패:", e);
      setIsLoggedIn(false);
    }
  }

  useEffect(() => {

    const redirectUrl = localStorage.getItem("redirectAfterLogin")
    if (redirectUrl) {
      localStorage.removeItem("redirectAfterLogin")
      window.location.href = redirectUrl
    }
    updateLoginState().then(r => setAuthChecked(true));
  }, []);

  return <AuthContext.Provider value={{ isLoggedIn, authChecked, login, logout, updateLoginState}}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
