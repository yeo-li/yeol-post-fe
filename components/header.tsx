"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, LogIn, LogOut, Monitor as SystemIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { LoginModal } from "./login-modal";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/about", label: "소개" },
  { href: "/categories", label: "카테고리" },
] as const;

export function Header() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { isLoggedIn, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme("light");
    } else if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("system");
    }
  };
  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);
  const handleLogout = () => {
    logout();
    if (typeof window !== "undefined" && window.location.pathname === "/admin") {
      window.location.href = "/";
    }
  };
  const goToAdmin = () => {
    if (typeof window !== "undefined") window.location.href = "/admin";
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-foreground" />
            <span className="font-bold text-xl">블로그</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
            {isLoggedIn && (
              <button onClick={goToAdmin} className="text-muted-foreground hover:text-foreground transition-colors">
                관리
              </button>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 rounded-full bg-muted/50 px-3 py-1.5">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-muted-foreground">관리자</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">로그아웃</span>
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={openLoginModal}
                className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">로그인</span>
              </Button>
            )}

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-muted relative">
              <Moon
                className={`h-5 w-5 transition-all ${
                  theme === "system"
                    ? "scale-0 -rotate-90"
                    : resolvedTheme === "dark"
                    ? "scale-100 rotate-0"
                    : "scale-0 -rotate-90"
                }`}
              />
              <Sun
                className={`absolute h-5 w-5 transition-all ${
                  theme === "system"
                    ? "scale-0 rotate-90"
                    : resolvedTheme === "light"
                    ? "scale-100 rotate-0"
                    : "scale-0 rotate-90"
                }`}
              />
              <SystemIcon
                className={`absolute h-5 w-5 transition-all ${
                  theme === "system" ? "scale-100 rotate-0" : "scale-0"
                }`}
              />
              <span className="sr-only">테마 토글</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t bg-background/95">
          <div className="container mx-auto flex items-center justify-center py-2 px-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
            {isLoggedIn && (
              <button onClick={goToAdmin} className="text-muted-foreground hover:text-foreground transition-colors ml-6">
                관리자
              </button>
            )}
          </div>
        </div>
      </header>
      <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} />
    </>
  );
}
