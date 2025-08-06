"use client"

import { useEffect, useState, useMemo } from "react"

interface Category {
  category_name: string
  post_count: number
}
interface Post {
  postId: number
  category: Category
  title: string
  summary: string
  content?: string
  published_at: string
  readTime: string
  tags: string[]
}

// (rest of imports unchanged)
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { NewsletterForm } from "@/components/newsletter-form"
import Link from "next/link"
import { fetchAllPosts, fetchCategoriesAndPostsCount } from "@/lib/api"

// Smart Summary 처리 함수
function getDisplaySummary(summary: string, content = "", maxLength = 150): string {
  // 1. summary가 있으면 우선 사용
  if (summary && summary.trim()) {
    return summary.length > maxLength ? summary.substring(0, maxLength) + "..." : summary
  }

  // 2. summary가 없으면 content에서 추출
  if (content && content.trim()) {
    const cleanContent = content.replace(/[#*`[\]]/g, "").trim()
    return cleanContent.length > maxLength ? cleanContent.substring(0, maxLength) + "..." : cleanContent
  }

  // 3. 둘 다 없으면 기본 메시지
  return "내용을 확인해보세요..."
}

export default function AllPostsPage() {
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [postsPerPage, setPostsPerPage] = useState<number>(6)
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryCount, setCategoryCount] = useState<number>(0)

  const loadData = async (): Promise<void> => {
    const categoryData = await fetchCategoriesAndPostsCount()
    const posts = await fetchAllPosts()
    setPostsPerPage(posts.length)
    setAllPosts(posts)
    setCategories(categoryData.filter(category => category.post_count > 0))
    setCategoryCount(categoryData.length)
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesSearch =
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.summary.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || post.category.category_name === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [allPosts, searchQuery, selectedCategory])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredPosts.length / postsPerPage)
  }, [filteredPosts, postsPerPage])

  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage
    return filteredPosts.slice(startIndex, startIndex + postsPerPage)
  }, [filteredPosts, currentPage, postsPerPage])

  const totalPosts = allPosts.length
  const averageReadTime = Math.round(
      allPosts.reduce((acc, post) => acc + Number.parseInt(post.readTime), 0) / totalPosts,
  )

  return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 md:mb-8 lg:mb-12">
            <p className="text-sm text-muted-foreground mb-2">All Posts</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">모든 글</h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl">
              지금까지 작성한 모든 블로그 포스트를 시간순으로 확인할 수 있습니다. 총 {totalPosts}개의 글이 있습니다.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="글 제목이나 내용으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="모든 카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 카테고리</SelectItem>
                {categories.map((category) => (
                    <SelectItem key={category.category_name} value={category.category_name}>
                      {category.category_name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
            <Card>
              <CardContent className="p-3 md:p-4 lg:p-6 text-center">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">{totalPosts}</div>
                <div className="text-xs md:text-sm text-muted-foreground">총 글</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 md:p-4 lg:p-6 text-center">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">{categoryCount}</div>
                <div className="text-xs md:text-sm text-muted-foreground">카테고리</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 md:p-4 lg:p-6 text-center">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">{averageReadTime || 5}</div>
                <div className="text-xs md:text-sm text-muted-foreground">태그 수</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 md:p-4 lg:p-6 text-center">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">2025</div>
                <div className="text-xs md:text-sm text-muted-foreground">블로그 시작</div>
              </CardContent>
            </Card>
          </div>

          {/* Category Quick Navigation */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">카테고리별 빠른 이동</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                  key="all"
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  className={`gap-2 ${
                      selectedCategory === "all"
                          ? "bg-foreground text-background hover:bg-foreground/90"
                          : "border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                  }`}
              >
                모든 게시물 ({totalPosts})
              </Button>
              {categories.map((category) => (
                  <Button
                      key={category.category_name}
                      variant={selectedCategory === category.category_name ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category.category_name)}
                      className={`gap-2 ${
                          selectedCategory === category.category_name
                              ? "bg-foreground text-background hover:bg-foreground/90"
                              : "border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                      }`}
                  >
                    {category.category_name} ({category.post_count})
                  </Button>
              ))}
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-8 md:mb-12">
            {currentPosts.map((post) => (
                <Link key={post.postId} href={`/posts/${post.postId}`}>
                  <Card className="group hover:shadow-lg transition-shadow cursor-pointer h-[280px] flex flex-col">
                    <CardHeader className="pb-3 flex-shrink-0">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary">{post.category.category_name}</Badge>
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
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                        {post.title}
                      </h3>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1 leading-relaxed">
                        {getDisplaySummary(post.summary, post.content)}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {post.tags?.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mb-12 md:mb-16 lg:mb-20">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                  이전
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={
                          currentPage === page
                              ? "bg-foreground text-background hover:bg-foreground/90"
                              : "border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                        }
                    >
                      {page}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                >
                  다음
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
          )}

          {/* Newsletter Section */}
          <section className="py-12 md:py-16 lg:py-20 bg-muted/50 rounded-lg">
            <div className="max-w-2xl mx-auto text-center px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">새 글 알림 받기</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
                새로운 블로그 포스트가 올라올 때마다 이메일로 알림을 받아보세요. 스팸은 절대 보내지 않겠습니다.
              </p>
              <NewsletterForm />
            </div>
          </section>
        </div>
      </div>
  )
}
