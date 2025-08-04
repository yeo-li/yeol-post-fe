"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, Loader2, Mail } from "lucide-react"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) return

    setStatus("loading")

    // 실제 구현에서는 API 호출
    setTimeout(() => {
      if (email.includes("@")) {
        setStatus("success")
        setMessage("구독이 완료되었습니다! 새로운 글 알림을 받아보세요.")
        setEmail("")
      } else {
        setStatus("error")
        setMessage("올바른 이메일 주소를 입력해주세요.")
      }
    }, 1000)
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <CheckCircle className="h-12 w-12 text-green-600" />
        <div className="text-center">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">구독 완료!</h3>
          <p className="text-sm text-green-700 dark:text-green-300">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="이메일 주소를 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            disabled={status === "loading"}
          />
        </div>
        <Button
          type="submit"
          disabled={status === "loading" || !email}
          className="bg-foreground text-background hover:bg-foreground/90"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              구독 중...
            </>
          ) : (
            "구독하기"
          )}
        </Button>
      </div>

      {status === "error" && <p className="text-sm text-red-600 dark:text-red-400 text-center">{message}</p>}

      <p className="text-xs text-muted-foreground text-center">
        언제든지 구독을 취소할 수 있습니다. 스팸은 절대 보내지 않습니다.
      </p>
    </form>
  )
}
