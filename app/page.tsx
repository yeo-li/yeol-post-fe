"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Heart, MessageCircle, ArrowRight } from 'lucide-react'
import Link from "next/link"
import { NewsletterForm } from "@/components/newsletter-form"
import { getRecentPosts } from "@/lib/data"

// Summary 처리 함수
function getDisplaySummary(summary: string, content = "", maxLength = 150): string {
  // summary가 있고 비어있지 않은 경우
  if (summary && summary.trim()) {
    return summary.length > maxLength ? summary.substring(0, maxLength) + "..." : summary
  }

  // summary가 없으면 content에서 추출
  if (content && content.trim()) {
    const cleanContent = content.replace(/[#*`[\]]/g, "").trim()
    return cleanContent.length > maxLength ? cleanContent.substring(0, maxLength) + "..." : cleanContent
  }

  // 둘 다 없으면 기본 메시지
  return "내용을 확인해보세요..."
}

export default function HomePage() {
  const [adminName, setAdminName] = useState<string | null>(null)
  const [recentPosts, setRecentPosts] = useState<any[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getRecentPosts()
        setRecentPosts(posts)
      } catch (err) {
        console.error("최근 글 불러오기 실패", err)
      }
    }
    const fetchAdminName = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/admins/me", {
          credentials: "include",
        })
        const data = await res.json()
        if (data.isLoggedIn) {
          setAdminName(data.nickname)
        }
      } catch (err) {
        console.error("관리자 정보 불러오기 실패", err)
      }
    }

    fetchPosts()
    fetchAdminName()
  }, [])

  let adminMessage = null
  if (adminName !== null) {
    adminMessage = "환영합니다, " + adminName + "님"
  }

  return (
      <div className="min-h-screen overflow-x-hidden">
        {/* Hero Section */}
        <section className="py-12 md:py-20 lg:py-32">
          <div className="container px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm text-muted-foreground mb-4">Welcome to my blog</p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight break-words">
                {adminMessage ?? "안녕하세요, 서여입니다."}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed max-w-3xl break-words">
                아키텍트가 되고 싶은 백엔드 개발자 지망생입니다.
                더 견고한 웹을 만들기 위해 노력하고 있습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link href="/about">
                  <Button size="lg" className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                    더 자세히 알아보기 <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/posts">
                  <Button
                      variant="outline"
                      size="lg"
                      className="border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                  >
                    모든 게시물 보기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts - Velog Style */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 break-words">최근 글</h2>
                <p className="text-base text-muted-foreground break-words">
                  개발하면서 배운 것들을 정리하고 공유합니다
                </p>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-12">
              {recentPosts.map((post, index) => (
                  <article key={post.postId} className="group">
                    <Link href={`/posts/${post.postId}`} className="block">
                      <div className="space-y-4 w-full overflow-hidden">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight break-words overflow-wrap-anywhere">
                          {post.title}
                        </h3>

                        <p className="text-base md:text-lg text-muted-foreground leading-relaxed break-words overflow-wrap-anywhere">
                          {getDisplaySummary(post.summary, post.content)}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1 break-words">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span className="break-words">{post.published_at?.split("T")[0]}</span>
                      </span>

                          {post.category && (
                              <span className="break-words overflow-hidden text-ellipsis">
                          {post.category.category_name}
                        </span>
                          )}

                          <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 flex-shrink-0" />
                        0
                      </span>
                        </div>

                        {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 w-full overflow-hidden">
                              {post.tags.map((tag: string) => (
                                  <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-xs px-2 py-1 bg-muted hover:bg-muted/80 break-words max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                                  >
                                    #{tag}
                                  </Badge>
                              ))}
                            </div>
                        )}
                      </div>
                    </Link>

                    {/* Divider - except for last item */}
                    {index < recentPosts.length - 1 && (
                        <div className="mt-12 border-b border-border"></div>
                    )}
                  </article>
              ))}
            </div>

            {/* More Posts Button */}
            {recentPosts.length > 0 && (
                <div className="text-center mt-16">
                  <Link href="/posts">
                    <Button
                        variant="outline"
                        size="lg"
                        className="gap-2 border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent px-8"
                    >
                      더 많은 포스트 보기
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 md:py-16 lg:py-20 bg-muted/50">
          <div className="container px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 break-words">새 글 알림 받기</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 break-words">
                새로운 블로그 포스트가 올라올 때마다 이메일로 알림을 받아보세요
              </p>
              <NewsletterForm />
            </div>
          </div>
        </section>
      </div>
  )
}
