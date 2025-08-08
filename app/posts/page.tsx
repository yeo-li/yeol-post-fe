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
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Search, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { NewsletterForm } from "@/components/newsletter-form"
import Link from "next/link"
import { fetchAllPosts, fetchCategoriesAndPostsCount } from "@/lib/api"

// 날짜 포맷팅 함수
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return dateString
  }
}

// 읽기 시간 계산 함수 (대략적으로 계산)
function calculateReadTime(content: string): string {
  const wordsPerMinute = 500
  const wordCount = content.length / 2 // 한글 기준 대략적 계산
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime}분`
}

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
  const [selectedTag, setSelectedTag] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [postsPerPage, setPostsPerPage] = useState<number>(6)
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  const loadData = async (): Promise<void> => {
    const categoryData = await fetchCategoriesAndPostsCount()
    const posts = await fetchAllPosts()
    setPostsPerPage(posts.length)
    setAllPosts(posts)
    setCategories(categoryData.filter(category => category.post_count > 0))
  }

  useEffect(() => {
    loadData()
  }, [])

  // 모든 태그 추출 및 카운트
  const allTags = useMemo(() => {
    const tagCount: { [key: string]: number } = {}
    allPosts.forEach(post => {
      post.tags?.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    })

    return Object.entries(tagCount)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
  }, [allPosts])

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesSearch =
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.summary.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || post.category.category_name === selectedCategory
      const matchesTag = selectedTag === "all" || post.tags?.includes(selectedTag)
      return matchesSearch && matchesCategory && matchesTag
    })
  }, [allPosts, searchQuery, selectedCategory, selectedTag])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredPosts.length / postsPerPage)
  }, [filteredPosts, postsPerPage])

  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage
    return filteredPosts.slice(startIndex, startIndex + postsPerPage)
  }, [filteredPosts, currentPage, postsPerPage])

  const totalPosts = allPosts.length

  return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <div className="container px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12 max-w-7xl mx-auto overflow-hidden">
          {/* Header */}
          <div className="mb-6 md:mb-8 lg:mb-12 overflow-hidden">
            <p className="text-sm text-muted-foreground mb-2">All Posts</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 break-words overflow-wrap-anywhere">모든 글</h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl break-words overflow-wrap-anywhere">
              지금까지 작성한 모든 블로그 포스트를 시간순으로 확인할 수 있습니다. 총 {totalPosts}개의 글이 있습니다.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8 overflow-hidden">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground flex-shrink-0" />
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

          {/* Mobile Tag Filter */}
          <div className="block lg:hidden mb-6 md:mb-8 overflow-hidden">
            <h3 className="text-lg font-semibold mb-4">태그 필터</h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <Badge
                  key="all-tags"
                  variant={selectedTag === "all" ? "default" : "outline"}
                  onClick={() => setSelectedTag("all")}
                  className={`cursor-pointer whitespace-nowrap flex-shrink-0 px-3 py-1.5 rounded-full transition-colors ${
                      selectedTag === "all"
                          ? "bg-foreground text-background hover:bg-foreground/90"
                          : "border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                  }`}
              >
                전체보기 ({totalPosts})
              </Badge>
              {allTags.map(({ tag, count }) => (
                  <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      onClick={() => setSelectedTag(tag)}
                      className={`cursor-pointer whitespace-nowrap flex-shrink-0 px-3 py-1.5 rounded-full transition-colors ${
                          selectedTag === tag
                              ? "bg-foreground text-background hover:bg-foreground/90"
                              : "border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                      }`}
                  >
                    {tag} ({count})
                  </Badge>
              ))}
            </div>
          </div>

          {/* Main Content with Sidebar */}
          <div className="flex justify-center gap-8 mb-8 md:mb-12">
            {/* Desktop Tag Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0 overflow-hidden">
              <div className="sticky top-8">
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-lg mb-4 pb-2 border-b">태그 목록</h3>
                  <div className="space-y-1 max-h-96 overflow-y-auto">
                    <button
                        key="all-tags-desktop"
                        onClick={() => setSelectedTag("all")}
                        className={`w-full text-left py-2 px-0 hover:text-primary transition-colors ${
                            selectedTag === "all"
                                ? "text-primary font-medium"
                                : "text-muted-foreground"
                        }`}
                    >
                      <span className="truncate">전체보기 ({totalPosts})</span>
                    </button>
                    {allTags.map(({ tag, count }) => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`w-full text-left py-2 px-0 hover:text-primary transition-colors ${
                                selectedTag === tag
                                    ? "text-primary font-medium"
                                    : "text-muted-foreground"
                            }`}
                        >
                          <span className="truncate">{tag} ({count})</span>
                        </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Content - Centered */}
            <div className="w-full max-w-4xl overflow-hidden">
              <div className="space-y-8 overflow-hidden">
                {currentPosts.map((post, index) => (
                    <div key={post.postId} className="w-full overflow-hidden">
                      <Link href={`/posts/${post.postId}`} className="group block">
                        <article className="py-8 overflow-hidden">
                          <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight break-words overflow-wrap-anywhere">
                            {post.title}
                          </h2>

                          <p className="text-muted-foreground mb-6 leading-relaxed text-base md:text-lg break-words overflow-wrap-anywhere">
                            {getDisplaySummary(post.summary, post.content, 200)}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
                            <span className="flex items-center gap-1 whitespace-nowrap">
                              <Calendar className="h-3 w-3 flex-shrink-0" />
                              {formatDate(post.published_at)}
                            </span>
                            <span className="flex items-center gap-1 whitespace-nowrap">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              {post.readTime || calculateReadTime(post.content)}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {post.category.category_name}
                            </Badge>
                            <span className="flex items-center gap-1 whitespace-nowrap">
                              <Heart className="h-3 w-3 flex-shrink-0" />
                              0
                            </span>
                          </div>

                          {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 overflow-hidden">
                                {post.tags.slice(0, 5).map((tag: string) => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="text-xs hover:bg-muted transition-colors max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                                    >
                                      #{tag}
                                    </Badge>
                                ))}
                                {post.tags.length > 5 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{post.tags.length - 5}
                                    </Badge>
                                )}
                              </div>
                          )}
                        </article>
                      </Link>
                      {index < currentPosts.length - 1 && <hr className="border-border" />}
                    </div>
                ))}
              </div>
            </div>

            {/* Right spacer for perfect centering */}
            <div className="hidden lg:block w-64 flex-shrink-0"></div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mb-12 md:mb-16 lg:mb-20 flex-wrap">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent flex-shrink-0"
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
                        className={`flex-shrink-0 ${
                            currentPage === page
                                ? "bg-foreground text-background hover:bg-foreground/90"
                                : "border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                        }`}
                    >
                      {page}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent flex-shrink-0"
                >
                  다음
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
          )}

          {/* Newsletter Section */}
          <section className="py-12 md:py-16 lg:py-20 bg-muted/50 rounded-lg overflow-hidden">
            <div className="max-w-2xl mx-auto text-center px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 break-words overflow-wrap-anywhere">새 글 알림 받기</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 break-words overflow-wrap-anywhere">
                새로운 블로그 포스트가 올라올 때마다 이메일로 알림을 받아보세요. 스팸은 절대 보내지 않겠습니다.
              </p>
              <NewsletterForm />
            </div>
          </section>
        </div>
      </div>
  )
}
