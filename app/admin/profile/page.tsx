"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    ArrowLeft,
    User,
    Save,
    Upload,
    Mail,
    Calendar,
    Shield,
    Activity,
    FileText,
    MessageCircle,
    Eye,
    TrendingUp,
    Loader2,
    Lock,
} from "lucide-react"
import Link from "next/link"
import { fetchLoginInformation } from "@/lib/api"

interface UserProfile {
    id: string
    email: string
    nickname: string
    profileImage?: string
    bio: string
    website: string
    location: string
    joinDate: string
    lastLogin: string
    role: "admin" | "user"
    isVerified: boolean
}

interface UserStats {
    totalPosts: number
    totalViews: number
    totalComments: number
    totalLikes: number
    monthlyViews: number[]
    recentActivity: {
        type: "post" | "comment" | "login"
        title: string
        date: string
    }[]
}

const mockProfile: UserProfile = {
    id: "1",
    email: "admin@blogger.com",
    nickname: "김블로거",
    profileImage: "/placeholder.svg?height=100&width=100",
    bio: "개발과 디자인에 관심이 많은 블로거입니다. 일상의 작은 발견들을 글로 기록하며, 더 나은 웹을 만들기 위해 노력하고 있습니다.",
    website: "https://myblog.com",
    location: "서울, 대한민국",
    joinDate: "2023-01-01",
    lastLogin: "2024-01-20 14:30",
    role: "admin",
    isVerified: true,
}

const mockStats: UserStats = {
    totalPosts: 28,
    totalViews: 15420,
    totalComments: 156,
    totalLikes: 892,
    monthlyViews: [1200, 1450, 1680, 1920, 2100, 1850, 2300, 2150, 1980, 2400, 2650, 2800],
    recentActivity: [
        { type: "post", title: '새 포스트 "React 18의 새로운 기능들" 발행', date: "2024-01-20 10:30" },
        { type: "comment", title: "댓글 5개에 답글 작성", date: "2024-01-19 16:45" },
        { type: "post", title: '포스트 "미니멀 디자인의 힘" 수정', date: "2024-01-18 09:15" },
        { type: "login", title: "관리자 대시보드 접속", date: "2024-01-17 14:20" },
        { type: "post", title: '새 포스트 "완벽한 아침 루틴" 발행', date: "2024-01-16 11:00" },
    ],
}

export default function AdminProfilePage() {
    const [profile, setProfile] = useState<UserProfile>(mockProfile)
    const [stats] = useState<UserStats>(mockStats)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    // 로그인 상태 관리
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
    const [userInfo, setUserInfo] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // 로그인 확인
    useEffect(() => {
        const checkLogin = async () => {
            setLoading(true)
            try {
                const loginInfo = await fetchLoginInformation()

                if (!loginInfo?.isLoggedIn) {
                    setIsLoggedIn(false)
                } else {
                    setIsLoggedIn(true)
                    setUserInfo(loginInfo.user)
                    // 실제 사용자 정보로 프로필 업데이트
                    setProfile((prev) => ({
                        ...prev,
                        nickname: loginInfo.user.nickname || prev.nickname,
                        email: loginInfo.user.email || prev.email,
                    }))
                }
            } catch (error) {
                console.error("로그인 확인 실패:", error)
                setIsLoggedIn(false)
            } finally {
                setLoading(false)
            }
        }

        checkLogin()
    }, [])

    // 로딩 중일 때 표시할 화면
    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">로그인 상태를 확인하는 중...</p>
                </div>
            </div>
        )
    }

    // 로그인되지 않은 경우
    if (isLoggedIn === false) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                        <Lock className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
                    <p className="text-muted-foreground mb-6">관리자 페이지에 접근하려면 로그인해주세요.</p>
                    <div className="space-y-3">
                        <Link href="/">
                            <Button className="w-full bg-foreground text-background hover:bg-foreground/90">홈으로 돌아가기</Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                            className="w-full border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                        >
                            다시 시도
                        </Button>
                    </div>
                </div>
            </div>
        )
    }

    const handleSave = async () => {
        setIsSaving(true)
        // 실제 구현에서는 API 호출
        setTimeout(() => {
            setIsSaving(false)
            alert("프로필이 저장되었습니다!")
        }, 1000)
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        // 실제 구현에서는 파일 업로드 API 호출
        setTimeout(() => {
            setIsUploading(false)
            alert("프로필 이미지가 업데이트되었습니다!")
        }, 2000)
    }

    const updateProfile = (key: keyof UserProfile, value: any) => {
        setProfile((prev) => ({ ...prev, [key]: value }))
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case "post":
                return <FileText className="h-4 w-4" />
            case "comment":
                return <MessageCircle className="h-4 w-4" />
            case "login":
                return <Shield className="h-4 w-4" />
            default:
                return <Activity className="h-4 w-4" />
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        관리자 대시보드로 돌아가기
                    </Link>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <User className="h-6 w-6" />
                                <h1 className="text-2xl md:text-3xl font-bold">마이페이지</h1>
                            </div>
                            <p className="text-muted-foreground">프로필 정보와 활동 통계를 확인하고 관리할 수 있습니다.</p>
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="gap-2 bg-foreground text-background hover:bg-foreground/90"
                        >
                            <Save className="h-4 w-4" />
                            {isSaving ? "저장 중..." : "프로필 저장"}
                        </Button>
                    </div>
                </div>

                {/* Profile Overview */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <div className="relative">
                                <Avatar className="w-24 h-24">
                                    <AvatarImage src={profile.profileImage || "/placeholder.svg"} alt={profile.nickname} />
                                    <AvatarFallback className="text-2xl">{profile.nickname.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <label className="absolute -bottom-2 -right-2 bg-foreground text-background rounded-full p-2 cursor-pointer hover:bg-foreground/90 transition-colors">
                                    <Upload className="h-4 w-4" />
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold">{profile.nickname}</h2>
                                    {profile.isVerified && (
                                        <Badge variant="secondary" className="gap-1">
                                            <Shield className="h-3 w-3" />
                                            인증됨
                                        </Badge>
                                    )}
                                    <Badge variant="outline" className="capitalize">
                                        {profile.role}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                      {profile.email}
                  </span>
                                    <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    가입일: {profile.joinDate}
                  </span>
                                </div>
                                <p className="text-muted-foreground">{profile.bio}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                            <div className="text-2xl font-bold">{stats.totalPosts}</div>
                            <div className="text-sm text-muted-foreground">총 포스트</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <Eye className="h-8 w-8 mx-auto mb-2 text-green-500" />
                            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">총 조회수</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                            <div className="text-2xl font-bold">{stats.totalComments}</div>
                            <div className="text-sm text-muted-foreground">총 댓글</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                            <div className="text-2xl font-bold">{stats.totalLikes}</div>
                            <div className="text-sm text-muted-foreground">총 좋아요</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Profile Tabs */}
                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="profile">프로필 편집</TabsTrigger>
                        <TabsTrigger value="activity">활동 내역</TabsTrigger>
                        <TabsTrigger value="security">보안 설정</TabsTrigger>
                    </TabsList>

                    {/* 프로필 편집 */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>기본 정보</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">닉네임</label>
                                        <Input
                                            value={profile.nickname}
                                            onChange={(e) => updateProfile("nickname", e.target.value)}
                                            placeholder="닉네임"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">이메일</label>
                                        <Input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => updateProfile("email", e.target.value)}
                                            placeholder="이메일 주소"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">소개</label>
                                    <Textarea
                                        value={profile.bio}
                                        onChange={(e) => updateProfile("bio", e.target.value)}
                                        placeholder="자신에 대한 소개를 작성해주세요"
                                        rows={4}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">웹사이트</label>
                                        <Input
                                            value={profile.website}
                                            onChange={(e) => updateProfile("website", e.target.value)}
                                            placeholder="https://example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">위치</label>
                                        <Input
                                            value={profile.location}
                                            onChange={(e) => updateProfile("location", e.target.value)}
                                            placeholder="서울, 대한민국"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 활동 내역 */}
                    <TabsContent value="activity" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>최근 활동</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {stats.recentActivity.map((activity, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                                            <div className="mt-1">{getActivityIcon(activity.type)}</div>
                                            <div className="flex-1">
                                                <p className="font-medium">{activity.title}</p>
                                                <p className="text-sm text-muted-foreground">{activity.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* 보안 설정 */}
                    <TabsContent value="security" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>계정 보안</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium">마지막 로그인</h4>
                                        <p className="text-sm text-muted-foreground">{profile.lastLogin}</p>
                                    </div>
                                    <Badge variant="outline" className="text-green-600">
                                        활성
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium">이메일 인증</h4>
                                        <p className="text-sm text-muted-foreground">{profile.isVerified ? "인증 완료" : "인증 필요"}</p>
                                    </div>
                                    <Badge variant={profile.isVerified ? "secondary" : "destructive"}>
                                        {profile.isVerified ? "인증됨" : "미인증"}
                                    </Badge>
                                </div>

                                <div className="space-y-3">
                                    <Button variant="outline" className="w-full justify-start bg-transparent">
                                        비밀번호 변경
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start bg-transparent">
                                        2단계 인증 설정
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start text-destructive bg-transparent">
                                        계정 삭제
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
