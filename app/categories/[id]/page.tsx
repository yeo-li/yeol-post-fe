"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

// Summary 처리 함수
function getDisplaySummary(excerpt: string, content: string, maxLength = 120): string {
    if (excerpt && excerpt.trim()) {
        return excerpt.length > maxLength ? excerpt.substring(0, maxLength) + "..." : excerpt
    }

    const cleanContent = content.replace(/[#*`[\]]/g, "").trim()
    return cleanContent.length > maxLength ? cleanContent.substring(0, maxLength) + "..." : cleanContent
}

// 카테고리별 색상 매핑
const getCategoryColorClasses = (categoryColor: string) => {
    const colorMap: { [key: string]: { badge: string; hover: string } } = {
        "#3B82F6": {
            badge: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
            hover: "group-hover:text-blue-600 dark:group-hover:text-blue-400",
        },
        "#8B5CF6": {
            badge: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
            hover: "group-hover:text-purple-600 dark:group-hover:text-purple-400",
        },
        "#10B981": {
            badge: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
            hover: "group-hover:text-green-600 dark:group-hover:text-green-400",
        },
        "#F59E0B": {
            badge: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
            hover: "group-hover:text-orange-600 dark:group-hover:text-orange-400",
        },
        "#EF4444": {
            badge: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
            hover: "group-hover:text-red-600 dark:group-hover:text-red-400",
        },
        "#EC4899": {
            badge: "bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300",
            hover: "group-hover:text-pink-600 dark:group-hover:text-pink-400",
        },
        "#6B7280": {
            badge: "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300",
            hover: "group-hover:text-gray-600 dark:group-hover:text-gray-400",
        },
    }

    return (
        colorMap[categoryColor] || {
            badge: "bg-gray-50 text-gray-700 dark:bg-gray-950 dark:text-gray-300",
            hover: "group-hover:text-gray-600 dark:group-hover:text-gray-400",
        }
    )
}

export default function DynamicCategoryPage() {
    const params = useParams()
    const id = params?.id as string
    const categoryName = decodeURIComponent(id).replace(/-/g, "/")
    const [posts, setPosts] = useState<any[]>([])
    const [currentCategory, setCurrentCategory] = useState<any>(null)
    const [otherCategories, setOtherCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                // 카테고리별 게시물 불러오기
                const postsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?category=${categoryName}`, {
                    method: "GET",
                    credentials: "include",
                })
                const postsJson = await postsResponse.json()
                setPosts(postsJson.result || [])

                // 모든 카테고리 불러오기
                const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
                    method: "GET",
                    credentials: "include",
                })
                const categoriesJson = await categoriesResponse.json()
                const allCategories = categoriesJson.result || []

                // 현재 카테고리 찾기
                const current = allCategories.find((cat: any) => cat.category_name === categoryName)
                setCurrentCategory(current)

                // 다른 카테고리들 (현재 카테고리 제외)
                const others = allCategories.filter((cat: any) => cat.category_name !== categoryName)
                setOtherCategories(others)
            } catch (error) {
                console.error("데이터 로딩 실패:", error)
            } finally {
                setLoading(false)
            }
        }

        if (categoryName) {
            loadData()
        }
    }, [categoryName])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
                    <p className="text-muted-foreground">카테고리를 불러오는 중...</p>
                </div>
            </div>
        )
    }

    const colorClasses = currentCategory ? getCategoryColorClasses(currentCategory.category_color) : null

    return (
        <div className="min-h-screen bg-background">
            <div className="container px-4 md:px-6 lg:px-8 py-8 md:py-12 max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        카테고리로 돌아가기
                    </Link>

                    <div className="text-center max-w-3xl mx-auto">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            {currentCategory && (
                                <>
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: currentCategory.category_color }}
                                    ></div>
                                    <Badge variant="secondary" className="text-sm">
                                        {categoryName}
                                    </Badge>
                                </>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryName}</h1>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                            {currentCategory?.category_description || `${categoryName} 카테고리의 다양한 글들을 확인해보세요.`}
                        </p>
                        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                <span>{posts.length}개 글</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Posts */}
                    <div className="lg:col-span-3">
                        {posts.length === 0 ? (
                            <div className="text-center py-16">
                                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">아직 게시물이 없습니다</h3>
                                <p className="text-muted-foreground mb-6">이 카테고리에 첫 번째 게시물을 작성해보세요.</p>
                                <Link href="/categories">
                                    <Button variant="outline" className="bg-transparent">
                                        다른 카테고리 보기
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {posts.map((post) => (
                                    <Link key={post.postId} href={`/posts/${post.postId}`}>
                                        <Card className="group hover:shadow-lg transition-all duration-300 border shadow-sm hover:shadow-xl my-4">
                                            <CardContent className="p-6 md:p-8">
                                                <div className="flex items-start justify-between mb-4">
                                                    <Badge variant="secondary" className={colorClasses?.badge || "bg-gray-50 text-gray-700"}>
                                                        {categoryName}
                                                    </Badge>
                                                    <div className="flex items-center text-xs text-muted-foreground gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                                {post.published_at?.split("T")[0]}
                            </span>
                                                        <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                                                            {post.readTime || "5분"}
                            </span>
                                                    </div>
                                                </div>

                                                <h2
                                                    className={`text-xl md:text-2xl font-bold mb-4 transition-colors leading-tight ${
                                                        colorClasses?.hover || "group-hover:text-primary"
                                                    }`}
                                                >
                                                    {post.title}
                                                </h2>

                                                <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-2">
                                                    {getDisplaySummary(post.summary, post.content, 150)}
                                                </p>

                                                <div className="flex flex-wrap gap-2">
                                                    {post.tags?.map((tag: string) => (
                                                        <Badge key={tag} variant="outline" className="text-xs hover:bg-muted transition-colors">
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <Card className="border shadow-sm">
                                <CardHeader className="pb-4">
                                    <h3 className="font-semibold text-lg">다른 카테고리</h3>
                                    <p className="text-sm text-muted-foreground">다양한 주제의 글들을 둘러보세요</p>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {otherCategories.map((category) => (
                                        <Link key={category.category_name} href={`/categories/${category.category_name.replace("/", "-")}`}>
                                            <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group my-2">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: category.category_color }}
                                                    ></div>
                                                    <span className="font-medium group-hover:text-foreground">{category.category_name}</span>
                                                </div>
                                                <Badge variant="secondary" className="text-xs">
                                                    {category.post_count}개
                                                </Badge>
                                            </div>
                                        </Link>
                                    ))}

                                    <div className="pt-4 border-t">
                                        <Link href="/categories">
                                            <Button variant="outline" className="w-full bg-transparent">
                                                모든 카테고리 보기
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
