"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Settings,
    Save,
    Globe,
    Shield,
    Palette,
    Bell,
    Database,
    Loader2,
    Lock,
    FileText,
    FolderOpen,
} from "lucide-react"
import { fetchLoginInformation } from "@/lib/api"
import { useRouter } from "next/navigation"

const sidebarItems = [
    { icon: FileText, label: "포스트 관리", active: false, href: "/admin" },
    { icon: Save, label: "임시저장 목록", active: false, href: "/admin/drafts" },
    { icon: FolderOpen, label: "카테고리", active: false, href: "/admin/categories" },
    { icon: Settings, label: "설정", active: true, href: "/admin/settings" },
]

interface BlogSettings {
    // 기본 설정
    siteName: string
    siteDescription: string
    siteUrl: string
    authorName: string
    authorEmail: string
    authorBio: string

    // 테마 설정
    theme: "light" | "dark" | "system"
    primaryColor: string

    // 기능 설정
    enableComments: boolean
    enableNewsletter: boolean
    enableSearch: boolean
    postsPerPage: number

    // SEO 설정
    metaTitle: string
    metaDescription: string
    metaKeywords: string

    // 소셜 미디어
    githubUrl: string
    twitterUrl: string
    linkedinUrl: string

    // 알림 설정
    emailNotifications: boolean
    newPostNotifications: boolean
    commentNotifications: boolean
}

const initialSettings: BlogSettings = {
    siteName: "김블로거 - 개발과 디자인 이야기",
    siteDescription: "개발과 디자인에 관심이 많은 블로거의 일상과 기술 이야기",
    siteUrl: "https://myblog.com",
    authorName: "김블로거",
    authorEmail: "hello@blogger.com",
    authorBio:
        "개발과 디자인에 관심이 많은 블로거입니다. 일상의 작은 발견들을 글로 기록하며, 더 나은 웹을 만들기 위해 노력하고 있습니다.",

    theme: "system",
    primaryColor: "#000000",

    enableComments: true,
    enableNewsletter: true,
    enableSearch: true,
    postsPerPage: 6,

    metaTitle: "김블로거 - 개발과 디자인 이야기",
    metaDescription: "개발과 디자인에 관심이 많은 블로거의 일상과 기술 이야기",
    metaKeywords: "개발, 디자인, 블로그, 웹개발, UI/UX",

    githubUrl: "https://github.com",
    twitterUrl: "https://twitter.com",
    linkedinUrl: "https://linkedin.com",

    emailNotifications: true,
    newPostNotifications: true,
    commentNotifications: false,
}

export default function AdminSettingsPage() {
    const router = useRouter()
    const [settings, setSettings] = useState<BlogSettings>(initialSettings)
    const [isSaving, setIsSaving] = useState(false)

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
                        <Button
                            onClick={() => router.push("/")}
                            className="w-full bg-foreground text-background hover:bg-foreground/90"
                        >
                            홈으로 돌아가기
                        </Button>
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
            alert("설정이 저장되었습니다!")
        }, 1000)
    }

    const updateSetting = (key: keyof BlogSettings, value: any) => {
        setSettings((prev) => ({ ...prev, [key]: value }))
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="flex flex-col lg:flex-row">
                {/* Sidebar */}
                <div className="w-full lg:w-64 border-b lg:border-r lg:border-b-0 bg-muted/10 p-4 md:p-6">
                    <div className="mb-6 md:mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 md:w-6 md:h-6 bg-foreground rounded-full"></div>
                            <span className="font-semibold text-sm md:text-base">{userInfo?.nickname || "관리자"}</span>
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">관리자</p>
                    </div>

                    <nav className="space-y-2">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.label}
                                variant={item.active ? "default" : "ghost"}
                                className={`w-full justify-start gap-2 ${
                                    item.active
                                        ? "bg-foreground text-background hover:bg-foreground/90"
                                        : "text-foreground hover:bg-muted"
                                }`}
                                onClick={() => router.push(item.href)}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6 md:mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Settings className="h-6 w-6" />
                                    <h1 className="text-2xl md:text-3xl font-bold">블로그 설정</h1>
                                </div>
                                <p className="text-muted-foreground">블로그의 전반적인 설정을 관리할 수 있습니다.</p>
                            </div>

                            <Button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="gap-2 bg-foreground text-background hover:bg-foreground/90"
                            >
                                <Save className="h-4 w-4" />
                                {isSaving ? "저장 중..." : "설정 저장"}
                            </Button>
                        </div>
                    </div>

                    {/* Settings Tabs */}
                    <Tabs defaultValue="general" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                            <TabsTrigger value="general" className="gap-2">
                                <Globe className="h-4 w-4" />
                                <span className="hidden sm:inline">일반</span>
                            </TabsTrigger>
                            <TabsTrigger value="appearance" className="gap-2">
                                <Palette className="h-4 w-4" />
                                <span className="hidden sm:inline">외관</span>
                            </TabsTrigger>
                            <TabsTrigger value="features" className="gap-2">
                                <Database className="h-4 w-4" />
                                <span className="hidden sm:inline">기능</span>
                            </TabsTrigger>
                            <TabsTrigger value="seo" className="gap-2">
                                <Shield className="h-4 w-4" />
                                <span className="hidden sm:inline">SEO</span>
                            </TabsTrigger>
                            <TabsTrigger value="notifications" className="gap-2">
                                <Bell className="h-4 w-4" />
                                <span className="hidden sm:inline">알림</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* 일반 설정 */}
                        <TabsContent value="general" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>기본 정보</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">사이트 이름</label>
                                            <Input
                                                value={settings.siteName}
                                                onChange={(e) => updateSetting("siteName", e.target.value)}
                                                placeholder="사이트 이름"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">사이트 URL</label>
                                            <Input
                                                value={settings.siteUrl}
                                                onChange={(e) => updateSetting("siteUrl", e.target.value)}
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">사이트 설명</label>
                                        <Textarea
                                            value={settings.siteDescription}
                                            onChange={(e) => updateSetting("siteDescription", e.target.value)}
                                            placeholder="사이트에 대한 간단한 설명"
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>작성자 정보</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">이름</label>
                                            <Input
                                                value={settings.authorName}
                                                onChange={(e) => updateSetting("authorName", e.target.value)}
                                                placeholder="작성자 이름"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">이메일</label>
                                            <Input
                                                type="email"
                                                value={settings.authorEmail}
                                                onChange={(e) => updateSetting("authorEmail", e.target.value)}
                                                placeholder="이메일 주소"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">소개</label>
                                        <Textarea
                                            value={settings.authorBio}
                                            onChange={(e) => updateSetting("authorBio", e.target.value)}
                                            placeholder="작성자에 대한 소개"
                                            rows={4}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>소셜 미디어</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">GitHub</label>
                                            <Input
                                                value={settings.githubUrl}
                                                onChange={(e) => updateSetting("githubUrl", e.target.value)}
                                                placeholder="https://github.com/username"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Twitter</label>
                                            <Input
                                                value={settings.twitterUrl}
                                                onChange={(e) => updateSetting("twitterUrl", e.target.value)}
                                                placeholder="https://twitter.com/username"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">LinkedIn</label>
                                            <Input
                                                value={settings.linkedinUrl}
                                                onChange={(e) => updateSetting("linkedinUrl", e.target.value)}
                                                placeholder="https://linkedin.com/in/username"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* 외관 설정 */}
                        <TabsContent value="appearance" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>테마 설정</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">테마 모드</label>
                                        <Select value={settings.theme} onValueChange={(value: any) => updateSetting("theme", value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light">라이트 모드</SelectItem>
                                                <SelectItem value="dark">다크 모드</SelectItem>
                                                <SelectItem value="system">시스템 설정</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">기본 색상</label>
                                        <div className="flex items-center gap-4">
                                            <Input
                                                type="color"
                                                value={settings.primaryColor}
                                                onChange={(e) => updateSetting("primaryColor", e.target.value)}
                                                className="w-20 h-10"
                                            />
                                            <Input
                                                value={settings.primaryColor}
                                                onChange={(e) => updateSetting("primaryColor", e.target.value)}
                                                placeholder="#000000"
                                                className="flex-1"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* 기능 설정 */}
                        <TabsContent value="features" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>사이트 기능</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">댓글 시스템</h4>
                                            <p className="text-sm text-muted-foreground">포스트에 댓글 기능을 활성화합니다</p>
                                        </div>
                                        <Switch
                                            checked={settings.enableComments}
                                            onCheckedChange={(checked) => updateSetting("enableComments", checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">뉴스레터</h4>
                                            <p className="text-sm text-muted-foreground">이메일 구독 기능을 활성화합니다</p>
                                        </div>
                                        <Switch
                                            checked={settings.enableNewsletter}
                                            onCheckedChange={(checked) => updateSetting("enableNewsletter", checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">검색 기능</h4>
                                            <p className="text-sm text-muted-foreground">포스트 검색 기능을 활성화합니다</p>
                                        </div>
                                        <Switch
                                            checked={settings.enableSearch}
                                            onCheckedChange={(checked) => updateSetting("enableSearch", checked)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">페이지당 포스트 수</label>
                                        <Select
                                            value={settings.postsPerPage.toString()}
                                            onValueChange={(value) => updateSetting("postsPerPage", Number.parseInt(value))}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="3">3개</SelectItem>
                                                <SelectItem value="6">6개</SelectItem>
                                                <SelectItem value="9">9개</SelectItem>
                                                <SelectItem value="12">12개</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* SEO 설정 */}
                        <TabsContent value="seo" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>검색 엔진 최적화</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">메타 제목</label>
                                        <Input
                                            value={settings.metaTitle}
                                            onChange={(e) => updateSetting("metaTitle", e.target.value)}
                                            placeholder="검색 결과에 표시될 제목"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">메타 설명</label>
                                        <Textarea
                                            value={settings.metaDescription}
                                            onChange={(e) => updateSetting("metaDescription", e.target.value)}
                                            placeholder="검색 결과에 표시될 설명"
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">키워드</label>
                                        <Input
                                            value={settings.metaKeywords}
                                            onChange={(e) => updateSetting("metaKeywords", e.target.value)}
                                            placeholder="키워드1, 키워드2, 키워드3"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* 알림 설정 */}
                        <TabsContent value="notifications" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>알림 설정</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">이메일 알림</h4>
                                            <p className="text-sm text-muted-foreground">중요한 알림을 이메일로 받습니다</p>
                                        </div>
                                        <Switch
                                            checked={settings.emailNotifications}
                                            onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">새 포스트 알림</h4>
                                            <p className="text-sm text-muted-foreground">새 포스트 발행 시 알림을 받습니다</p>
                                        </div>
                                        <Switch
                                            checked={settings.newPostNotifications}
                                            onCheckedChange={(checked) => updateSetting("newPostNotifications", checked)}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">댓글 알림</h4>
                                            <p className="text-sm text-muted-foreground">새 댓글이 달릴 때 알림을 받습니다</p>
                                        </div>
                                        <Switch
                                            checked={settings.commentNotifications}
                                            onCheckedChange={(checked) => updateSetting("commentNotifications", checked)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
