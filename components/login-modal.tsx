"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Lock, X, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleKakaoLogin = async () => {
    setIsLoading(true)

    // 현재 위치 저장
    localStorage.setItem("redirectAfterLogin", window.location.href)

    // OAuth2 카카오 인증 엔드포인트로 리다이렉트
    window.location.href = `${process.env.NEXT_PUBLIC_URL}/oauth2/authorization/kakao`
  }

  const handleEmailLogin = async () => {
    if (!email || !password) {
      // 이메일 또는 비밀번호가 입력되지 않았을 경우 처리 (예: 알림)
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      onClose(); // 로그인이 성공하면 모달을 닫습니다.
    } catch (error) {
      console.error("Login failed", error);
      // 로그인 실패 시 사용자에게 에러 메시지를 보여주는 로직을 추가할 수 있습니다.
      alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <Card className="w-full max-w-md relative shadow-2xl border-0">
          <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 hover:bg-muted rounded-full"
              onClick={handleClose}
              disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>

          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">관리자 로그인</CardTitle>
            <p className="text-sm text-muted-foreground">블로그 관리를 위해 로그인해주세요</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
              <Input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                disabled={isLoading}
              />
              <Button onClick={handleEmailLogin} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  "로그인"
                )}
              </Button>
            </div>

            {/* 구분선 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">또는</span>
              </div>
            </div>

            {/* 카카오톡 로그인 버튼 */}
            <button
                onClick={handleKakaoLogin}
                disabled={isLoading}
                className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#F9A825] rounded-lg flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed font-medium text-[#191919] text-base shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin text-[#191919]" />
                    로그인 중...
                  </>
              ) : (
                  <>
                    {/* 카카오톡 말풍선 아이콘 */}
                    <div className="flex-shrink-0">
                      <Image
                          src="/images/kakao-speech-bubble.png"
                          alt="카카오톡 말풍선"
                          width={20}
                          height={18}
                          className="w-5 h-[18px] object-contain"
                      />
                    </div>
                    카카오 로그인
                  </>
              )}
            </button>



            {/*/!* 게스트 로그인 (데모용) *!/*/}
            {/*<Button*/}
            {/*    variant="outline"*/}
            {/*    onClick={() => {*/}
            {/*      setIsLoading(true)*/}
            {/*      setTimeout(() => {*/}
            {/*        setIsLoading(false)*/}
            {/*        onClose()*/}
            {/*      }, 1000)*/}
            {/*    }}*/}
            {/*    disabled={isLoading}*/}
            {/*    className="w-full h-11 border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"*/}
            {/*>*/}
            {/*  {isLoading ? (*/}
            {/*      <>*/}
            {/*        <Loader2 className="mr-2 h-4 w-4 animate-spin" />*/}
            {/*        로그인 중...*/}
            {/*      </>*/}
            {/*  ) : (*/}
            {/*      "데모 계정으로 로그인"*/}
            {/*  )}*/}
            {/*</Button>*/}

            {/*/!* 안내 메시지 *!/*/}
            {/*<div className="bg-muted/30 rounded-lg p-4 text-center border border-muted">*/}
            {/*  <p className="text-sm font-medium text-muted-foreground mb-2">데모 환경 안내</p>*/}
            {/*  <p className="text-xs text-muted-foreground leading-relaxed">*/}
            {/*    실제 서비스에서는 카카오톡 로그인을 통해 안전하게 인증됩니다.*/}
            {/*    <br />*/}
            {/*    현재는 데모 환경으로 "데모 계정으로 로그인" 버튼을 사용해주세요.*/}
            {/*  </p>*/}
            {/*</div>*/}
          </CardContent>
        </Card>
      </div>
  )
}
