"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Plus,
    Trash2,
    Search,
    FolderOpen,
    Save,
    Loader2,
    Lock,
    FileText,
    Settings,
    AlertCircle,
    Edit,
    Palette,
    Pipette,
} from "lucide-react"
import {
    fetchLoginInformation,
    fetchCategoriesAndPostsCount,
    fetchSaveCategory,
    fetchDeleteCategory,
    fetchUpdateCategory,
} from "@/lib/api"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"

const sidebarItems = [
    { icon: FileText, label: "포스트 관리", active: false, href: "/admin" },
    { icon: Save, label: "임시저장 목록", active: false, href: "/admin/drafts" },
    { icon: FolderOpen, label: "카테고리", active: true, href: "/admin/categories" },
    { icon: Settings, label: "설정", href: "/admin/settings" },
]

interface Category {
    category_id: number
    category_name: string
    category_description: string
    category_color: string
    post_count: number
}

// 확장된 색상 옵션들
const presetColors = [
    // 기본 색상
    { name: "파란색", value: "#3B82F6", group: "기본" },
    { name: "보라색", value: "#8B5CF6", group: "기본" },
    { name: "초록색", value: "#10B981", group: "기본" },
    { name: "주황색", value: "#F59E0B", group: "기본" },
    { name: "빨간색", value: "#EF4444", group: "기본" },
    { name: "분홍색", value: "#EC4899", group: "기본" },
    { name: "회색", value: "#6B7280", group: "기본" },

    // 추가 색상
    { name: "하늘색", value: "#06B6D4", group: "확장" },
    { name: "라임", value: "#84CC16", group: "확장" },
    { name: "오렌지", value: "#F97316", group: "확장" },
    { name: "로즈", value: "#F43F5E", group: "확장" },
    { name: "바이올렛", value: "#7C3AED", group: "확장" },
    { name: "에메랄드", value: "#059669", group: "확장" },
    { name: "인디고", value: "#4F46E5", group: "확장" },
    { name: "틸", value: "#0D9488", group: "확장" },

    // 파스텔 색상
    { name: "파스텔 블루", value: "#93C5FD", group: "파스텔" },
    { name: "파스텔 퍼플", value: "#C4B5FD", group: "파스텔" },
    { name: "파스텔 그린", value: "#86EFAC", group: "파스텔" },
    { name: "파스텔 옐로우", value: "#FDE047", group: "파스텔" },
    { name: "파스텔 핑크", value: "#F9A8D4", group: "파스텔" },
    { name: "파스텔 오렌지", value: "#FDBA74", group: "파스텔" },

    // 다크 색상
    { name: "다크 블루", value: "#1E40AF", group: "다크" },
    { name: "다크 퍼플", value: "#6B21A8", group: "다크" },
    { name: "다크 그린", value: "#047857", group: "다크" },
    { name: "다크 레드", value: "#B91C1C", group: "다크" },
    { name: "다크 그레이", value: "#374151", group: "다크" },
    { name: "다크 브라운", value: "#92400E", group: "다크" },
]

function CategoryForm({
                          category,
                          onSave,
                          onCancel,
                          isLoading,
                          isEdit = false,
                      }: {
    category?: Category
    onSave: (category: { category_name: string; category_description: string; category_color: string }) => void
    onCancel: () => void
    isLoading: boolean
    isEdit?: boolean
}) {
    const [formData, setFormData] = useState({
        category_name: category?.category_name || "",
        category_description: category?.category_description || "",
        category_color: category?.category_color || "#3B82F6",
    })
    const [customColor, setCustomColor] = useState("")
    const [activeTab, setActiveTab] = useState("preset")

    // 수정 모드일 때 기존 데이터로 폼 초기화
    useEffect(() => {
        if (isEdit && category) {
            setFormData({
                category_name: category.category_name,
                category_description: category.category_description,
                category_color: category.category_color,
            })
            setCustomColor(category.category_color)
        }
    }, [isEdit, category])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.category_name.trim()) return

        onSave(formData)
    }

    const handlePresetColorSelect = (color: string) => {
        setFormData({ ...formData, category_color: color })
        setCustomColor(color)
    }

    const handleCustomColorChange = (color: string) => {
        setCustomColor(color)
        setFormData({ ...formData, category_color: color })
    }

    // 색상을 그룹별로 분류
    const colorGroups = presetColors.reduce(
        (groups, color) => {
            if (!groups[color.group]) {
                groups[color.group] = []
            }
            groups[color.group].push(color)
            return groups
        },
        {} as Record<string, typeof presetColors>,
    )

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">카테고리 이름 *</label>
                    <Input
                        value={formData.category_name}
                        onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                        placeholder="카테고리 이름을 입력하세요"
                        maxLength={20}
                        required
                        disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{formData.category_name.length}/20자</p>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">설명</label>
                <Textarea
                    value={formData.category_description}
                    onChange={(e) => setFormData({ ...formData, category_description: e.target.value })}
                    placeholder="카테고리에 대한 설명을 입력하세요"
                    rows={3}
                    disabled={isLoading}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-4">색상</label>

                {/* 색상 미리보기 */}
                <div className="flex items-center gap-3 mb-4 p-3 border rounded-lg bg-muted/20">
                    <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                        style={{ backgroundColor: formData.category_color }}
                    ></div>
                    <div>
                        <p className="font-medium">선택된 색상</p>
                        <p className="text-sm text-muted-foreground">{formData.category_color}</p>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="preset" className="gap-2">
                            <Palette className="h-4 w-4" />
                            프리셋 색상
                        </TabsTrigger>
                        <TabsTrigger value="custom" className="gap-2">
                            <Pipette className="h-4 w-4" />
                            커스텀 색상
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="preset" className="space-y-4 mt-4">
                        {Object.entries(colorGroups).map(([groupName, colors]) => (
                            <div key={groupName}>
                                <h4 className="text-sm font-medium mb-2 text-muted-foreground">{groupName}</h4>
                                <div className="grid grid-cols-6 gap-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => handlePresetColorSelect(color.value)}
                                            className={`p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                                                formData.category_color === color.value
                                                    ? "border-foreground shadow-md"
                                                    : "border-muted hover:border-muted-foreground"
                                            }`}
                                            disabled={isLoading}
                                            title={color.name}
                                        >
                                            <div
                                                className="w-6 h-6 rounded-full mx-auto shadow-sm"
                                                style={{ backgroundColor: color.value }}
                                            ></div>
                                            <span className="text-xs mt-1 block truncate">{color.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </TabsContent>

                    <TabsContent value="custom" className="space-y-4 mt-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">색상 선택기</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={customColor}
                                        onChange={(e) => handleCustomColorChange(e.target.value)}
                                        className="w-16 h-10 rounded border cursor-pointer"
                                        disabled={isLoading}
                                    />
                                    <Input
                                        value={customColor}
                                        onChange={(e) => handleCustomColorChange(e.target.value)}
                                        placeholder="#000000"
                                        pattern="^#[0-9A-Fa-f]{6}$"
                                        className="flex-1"
                                        disabled={isLoading}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    HEX 색상 코드를 입력하거나 색상 선택기를 사용하세요
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">빠른 색상</label>
                                <div className="grid grid-cols-8 gap-2">
                                    {[
                                        "#FF6B6B",
                                        "#4ECDC4",
                                        "#45B7D1",
                                        "#96CEB4",
                                        "#FFEAA7",
                                        "#DDA0DD",
                                        "#98D8C8",
                                        "#F7DC6F",
                                        "#BB8FCE",
                                        "#85C1E9",
                                        "#F8C471",
                                        "#82E0AA",
                                        "#F1948A",
                                        "#85929E",
                                        "#D7BDE2",
                                        "#A9DFBF",
                                    ].map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => handleCustomColorChange(color)}
                                            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                                                customColor === color ? "border-foreground" : "border-muted"
                                            }`}
                                            style={{ backgroundColor: color }}
                                            disabled={isLoading}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            <div className="flex gap-2 pt-4">
                <Button
                    type="submit"
                    className="gap-2 bg-foreground text-background hover:bg-foreground/90"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {isEdit ? "수정 중..." : "저장 중..."}
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            {isEdit ? "수정" : "저장"}
                        </>
                    )}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    취소
                </Button>
            </div>
        </form>
    )
}

export default function AdminCategoriesPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // 로그인 상태 관리
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
    const [userInfo, setUserInfo] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // 카테고리 목록 불러오기
    const loadCategories = async () => {
        try {
            setError(null)
            const categoriesData = await fetchCategoriesAndPostsCount()
            setCategories(categoriesData)
        } catch (error) {
            console.error("카테고리 목록 불러오기 실패:", error)
            setError("카테고리 목록을 불러오는데 실패했습니다.")
        }
    }

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
                    // 로그인 성공 시 카테고리 목록 불러오기
                    await loadCategories()
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

    const filteredCategories = categories.filter(
        (category) =>
            category.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.category_description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const handleCreateCategory = async (categoryData: {
        category_name: string
        category_description: string
        category_color: string
    }) => {
        setIsLoading(true)
        setError(null)

        try {
            await fetchSaveCategory(categoryData)
            setIsCreateDialogOpen(false)
            // 카테고리 목록 새로고침
            await loadCategories()
        } catch (error) {
            console.error("카테고리 생성 실패:", error)
            setError("카테고리 생성에 실패했습니다.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditCategory = async (categoryData: {
        category_name: string
        category_description: string
        category_color: string
    }) => {
        if (!editingCategory) return

        setIsLoading(true)
        setError(null)

        try {
            await fetchUpdateCategory(editingCategory.category_id, {
                category_name: categoryData.category_name,
                category_color: categoryData.category_color,
                category_description: categoryData.category_description,
            })
            setIsEditDialogOpen(false)
            setEditingCategory(null)
            // 카테고리 목록 새로고침
            await loadCategories()
        } catch (error) {
            console.error("카테고리 수정 실패:", error)
            setError("카테고리 수정에 실패했습니다.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteCategory = async (categoryId: number) => {
        if (!confirm("정말로 이 카테고리를 삭제하시겠습니까?")) {
            return
        }

        setError(null)

        try {
            await fetchDeleteCategory(categoryId)
            // 카테고리 목록 새로고침
            await loadCategories()
        } catch (error) {
            console.error("카테고리 삭제 실패:", error)
            setError("카테고리 삭제에 실패했습니다.")
        }
    }

    const openEditDialog = (category: Category) => {
        setEditingCategory(category)
        setIsEditDialogOpen(true)
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
                        <div className="flex items-center gap-3 mb-4">
                            <FolderOpen className="h-6 w-6" />
                            <h1 className="text-2xl md:text-3xl font-bold">카테고리 관리</h1>
                        </div>
                        <p className="text-muted-foreground">블로그 카테고리를 생성, 수정, 삭제할 수 있습니다.</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert className="mb-6 border-red-200 bg-red-50">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800">{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="카테고리 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                                    <Plus className="h-4 w-4" />새 카테고리
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>새 카테고리 만들기</DialogTitle>
                                </DialogHeader>
                                <CategoryForm
                                    onSave={handleCreateCategory}
                                    onCancel={() => setIsCreateDialogOpen(false)}
                                    isLoading={isLoading}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {filteredCategories.map((category) => (
                            <Card
                                key={category.category_id}
                                className="hover:shadow-lg transition-shadow border-l-4"
                                style={{ borderLeftColor: category.category_color }}
                            >
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-4 h-4 rounded-full shadow-sm"
                                                style={{ backgroundColor: category.category_color }}
                                            ></div>
                                            <CardTitle className="text-lg">{category.category_name}</CardTitle>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditDialog(category)}
                                                className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                                title="카테고리 수정"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDeleteCategory(category.category_id)}
                                                className="text-destructive hover:text-destructive hover:bg-muted"
                                                title="카테고리 삭제"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {category.category_description || "설명이 없습니다."}
                                    </p>
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-4">
                      <span className="text-muted-foreground">
                        색상: <code className="bg-muted px-1 rounded text-xs">{category.category_color}</code>
                      </span>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            style={{ borderColor: category.category_color, color: category.category_color }}
                                        >
                                            {category.post_count}개 글
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredCategories.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">카테고리가 없습니다</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchQuery ? "검색 결과가 없습니다." : "첫 번째 카테고리를 만들어보세요."}
                            </p>
                            {!searchQuery && (
                                <Button
                                    onClick={() => setIsCreateDialogOpen(true)}
                                    className="gap-2 bg-foreground text-background hover:bg-foreground/90"
                                >
                                    <Plus className="h-4 w-4" />새 카테고리 만들기
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold">{categories.length}</div>
                                <div className="text-sm text-muted-foreground">총 카테고리</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4 text-center">
                                <div className="text-2xl font-bold">{categories.reduce((sum, cat) => sum + cat.post_count, 0)}</div>
                                <div className="text-sm text-muted-foreground">총 포스트</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Edit Category Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>카테고리 수정</DialogTitle>
                    </DialogHeader>
                    {editingCategory && (
                        <CategoryForm
                            category={editingCategory}
                            onSave={handleEditCategory}
                            onCancel={() => {
                                setIsEditDialogOpen(false)
                                setEditingCategory(null)
                            }}
                            isLoading={isLoading}
                            isEdit={true}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
