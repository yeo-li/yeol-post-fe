"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { NewsletterForm } from "@/components/newsletter-form"
import { getRecentPosts } from "@/lib/data"

// Summary 처리 함수
function getDisplaySummary(summary: string, content = "", maxLength = 120): string {
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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admins/me`, {
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
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="py-12 md:py-20 lg:py-32">
          <div className="container px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm text-muted-foreground mb-4">Welcome to my blog</p>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
                {adminMessage ?? "안녕하세요, 박성열입니다."}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 leading-relaxed max-w-3xl">
                아키텍트가 되고 싶은 백엔드 개발자 지망생입니다. 더 견고한 웹을 만들기 위해 노력하고 있습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link href="/about">
                  <Button size="lg" className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                    더 자세히 알아보기 <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button
                      variant="outline"
                      size="lg"
                      className="border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                  >
                    카테고리 둘러보기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">최근 글</h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  새로 업데이트된 블로그 포스트들을 확인해보세요
                </p>
              </div>
              <Link href="/posts">
                <Button variant="ghost" className="gap-2 text-foreground hover:bg-muted">
                  모든 글 보기 <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                  <Link key={post.postId} href={`/posts/${post.postId}`}>
                    <Card className="group hover:shadow-lg transition-shadow h-[280px] flex flex-col">
                      <CardHeader className="pb-3 flex-shrink-0">
                        <div className="flex items-center justify-between mb-3">
                          {post.category && <Badge variant="secondary">{post.category.category_name}</Badge>}
                          <div className="flex items-center text-xs text-muted-foreground gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.published_at?.split("T")[0]}
                        </span>
                        {/*    <span className="flex items-center gap-1">*/}
                        {/*  /!*<Clock className="h-3 w-3" />*!/*/}
                        {/*  /!*    {post.readTime ?? "5분"}*!/*/}
                        {/*</span>*/}
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
                          {post.tags?.map((tag: string) => (
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
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 md:py-16 lg:py-20 bg-muted/50">
          <div className="container px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">새 글 알림 받기</h2>
              {/*<p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">*/}
              {/*  새로운 블로그 포스트가 올라올 때마다 이메일로 알림을 받아보세요*/}
              {/*</p>*/}
              <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
                아직 기능이 구현되지 않았습니다. 조금만 기다려주세요!
              </p>
              <NewsletterForm />
            </div>
          </div>
        </section>
      </div>
  )
}
