"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, Share2, ThumbsUp, MessageCircle, Edit, Eye, Heart, Send, Reply } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {fetchPost, fetchLoginInformation, increasePostViews} from "@/lib/api"
import { use, useEffect, useState, useRef } from "react" 
import MDEditor from "@uiw/react-md-editor"

// 댓글 타입 정의
interface Comment {
  id: number
  author: string
  content: string
  createdAt: string
  avatar?: string
  replies?: Comment[]
}

// 임시 댓글 데이터
const mockComments: Comment[] = [
  {
    id: 1,
    author: "개발자김씨",
    content:
        "정말 유용한 글이네요! React 18의 새로운 기능들을 이해하는데 많은 도움이 되었습니다. 특히 Concurrent Features 부분이 인상깊었어요.",
    createdAt: "2024-01-20 15:30",
    avatar: "/placeholder.svg?height=40&width=40",
    replies: [
      {
        id: 2,
        author: "김블로거",
        content: "감사합니다! 도움이 되셨다니 기쁘네요. 다음에는 Suspense에 대해서도 더 자세히 다뤄보겠습니다.",
        createdAt: "2024-01-20 16:15",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: 3,
    author: "프론트엔드러버",
    content: "코드 예제가 정말 이해하기 쉽게 잘 작성되어 있네요. 실제 프로젝트에 바로 적용해볼 수 있을 것 같아요!",
    createdAt: "2024-01-20 14:45",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    author: "신입개발자",
    content:
        "아직 React를 배우고 있는 단계인데, 이런 고급 기능들도 있다는 걸 알게 되어 좋네요. 더 열심히 공부해야겠어요!",
    createdAt: "2024-01-20 13:20",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function PostDetailPage({ params }: { params: Promise<{ id: number }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [post, setPost] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [userInfo, setUserInfo] = useState<any>(null)

  // 상호작용 상태
  // const [isLiked, setIsLiked] = useState(false)
  // const [likeCount, setLikeCount] = useState(0)
  const [viewCount, setViewCount] = useState(0)
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const dataLoaded = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      // 게시물 데이터 로드
      const result = await fetchPost({ postId: id })
      console.log(result)
      setPost(result)

      await increasePostViews(id);
      setViewCount(result.views + 1)

      // 로그인 상태 확인
      try {
        const loginInfo = await fetchLoginInformation()
        if (loginInfo?.isLoggedIn) {
          setIsLoggedIn(true)
          setUserInfo(loginInfo.user)
        }
      } catch (error) {
        console.error("로그인 상태 확인 실패:", error)
      }
    }
    if (!dataLoaded.current) {
      loadData()
      dataLoaded.current = true;
    }
  }, [id, post])

  const handleGoBack = () => {
    router.back()
  }

  const handleEdit = () => {
    router.push(`/admin/write?id=${id}`)
  }

  // const handleLike = () => {
  //   setIsLiked(!isLiked)
  //   setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  // }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now(),
      author: userInfo?.nickname || "익명",
      content: newComment,
      createdAt: new Date().toLocaleString("ko-KR"),
      avatar: userInfo?.profileImage || "/placeholder.svg?height=40&width=40",
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleReplySubmit = (commentId: number) => {
    if (!replyContent.trim()) return

    const reply: Comment = {
      id: Date.now(),
      author: userInfo?.nickname || "익명",
      content: replyContent,
      createdAt: new Date().toLocaleString("ko-KR"),
      avatar: userInfo?.profileImage || "/placeholder.svg?height=40&width=40",
    }

    setComments(
        comments.map((comment) =>
            comment.id === commentId ? { ...comment, replies: [...(comment.replies || []), reply] } : comment,
        ),
    )
    setReplyContent("")
    setReplyingTo(null)
  }

  // 시간 표시 문자열 생성 함수
  const getTimeDisplay = () => {
    if (!post) return ""
    const published = new Date(post.published_at)
    const now = new Date()
    const diffMs = now.getTime() - published.getTime()
    const diffMinutes = Math.floor(diffMs / 60000)
    if (diffMinutes < 60) {
      return `${diffMinutes}분 전`
    }
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) {
      return `${diffHours}시간 전`
    }
    // 24시간 이상: 날짜 및 시간 표시
    const year = published.getFullYear()
    const month = (published.getMonth() + 1).toString().padStart(2, "0")
    const date = published.getDate().toString().padStart(2, "0")
    const hours = published.getHours()
    const minutes = published.getMinutes().toString().padStart(2, "0")
    const ampm = hours < 12 ? "오전" : "오후"
    const hour12 = hours % 12 === 0 ? 12 : hours % 12
    // return `${year}-${month}-${date} ${ampm} ${hour12}:${minutes}`
    return `${year}-${month}-${date}`
  }

  if (!post) {
    return (
        <div className="container px-4 md:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">포스트를 찾을 수 없습니다</h1>
          <Link href="/posts">
            <Button>전체 글 목록으로 돌아가기</Button>
          </Link>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-6xl mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Header with Back Button and Edit Button */}
            <div className="flex items-center justify-between mb-8">
              <button
                  onClick={handleGoBack}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                뒤로가기
              </button>

              {/* Edit Button - Only show if logged in */}
              {isLoggedIn && (
                  <Button
                      onClick={handleEdit}
                      variant="outline"
                      size="sm"
                      className="gap-2 border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                  >
                    <Edit className="h-4 w-4" />
                    수정하기
                  </Button>
              )}
            </div>

            {/* Category */}
            <div className="mb-6">
              <Badge variant="secondary" className="text-sm">
                {post.category.category_name}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-foreground">
              {post.title}
            </h1>

            {/* Subtitle */}
            {post.summary && (
                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed break-words">{post.summary}</p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{getTimeDisplay()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>작성자: {post.author}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{viewCount.toLocaleString()}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-12">
              {post.tags.map((tag: string) => (
                  <span key={tag} className="text-sm text-muted-foreground">
                #{tag}
              </span>
              ))}
            </div>

            {/* Content */}
            <article className="prose prose-lg max-w-none mb-16 dark:prose-invert">
              <MDEditor.Markdown
                  source={post.content}
                  className="prose prose-lg max-w-none bg-background text-foreground dark:bg-background dark:prose-invert dark:text-foreground"
                  style={{ width: "100%" }}
              />
              <style jsx global>{`
              /* Override react-md-editor preview wrapper colors */
              .w-md-editor .wmde-markdown-color,
              .w-md-editor .wmde-markdown-wrapper,
              .w-md-editor-wrapper,
              .wmde-markdown {
                background-color: hsl(var(--background)) !important;
                color: hsl(var(--foreground)) !important;
              }
              /* Broad list styling */
              ul {
                list-style-position: inside !important;
                list-style-type: disc !important;
              }
              ol {
                list-style-position: inside !important;
                list-style-type: decimal !important;
              }
              li {
                color: hsl(var(--foreground)) !important;
              }
              /* Style markers for both ul and ol */
              ul li::marker,
              ol li::marker {
                color: hsl(var(--foreground)) !important;
              }
            `}</style>
            </article>

            <Separator className="mb-8" />

            {/* Engagement Actions */}
            <div className="flex items-center justify-between mb-12">
              {/*<p className="text-sm text-muted-foreground">이 글이 도움이 되셨나요?</p>*/}
              <div className="flex items-center gap-4">
                {/*<Button*/}
                {/*    variant="ghost"*/}
                {/*    size="sm"*/}
                {/*    className={`gap-2 transition-colors ${*/}
                {/*        isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"*/}
                {/*    }`}*/}
                {/*    onClick={handleLike}*/}
                {/*>*/}
                {/*  <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />*/}
                {/*  좋아요 {likeCount}*/}
                {/*</Button>*/}
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <Share2 className="h-4 w-4" />
                  공유하기
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5" />
                <h2 className="text-xl font-bold">댓글 {comments.length}개</h2>
              </div>

              {/* Comment Form */}
              {isLoggedIn ? (
                  <Card>
                    <CardContent className="p-6">
                      <form onSubmit={handleCommentSubmit} className="space-y-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={userInfo?.profileImage || "/placeholder.svg"} alt={userInfo?.nickname} />
                            <AvatarFallback>{userInfo?.nickname?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Textarea
                                placeholder="댓글을 작성해주세요..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="min-h-[100px] resize-none"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button
                              type="submit"
                              disabled={!newComment.trim()}
                              className="gap-2 bg-foreground text-background hover:bg-foreground/90"
                          >
                            <Send className="h-4 w-4" />
                            댓글 작성
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
              ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground mb-4">댓글을 작성하려면 로그인이 필요합니다.</p>
                      <Button variant="outline">로그인하기</Button>
                    </CardContent>
                  </Card>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                    <Card key={comment.id} className="border-l-4 border-l-muted">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold">{comment.author}</span>
                              <span className="text-sm text-muted-foreground">{comment.createdAt}</span>
                            </div>
                            <p className="text-foreground mb-3 leading-relaxed">{comment.content}</p>
                            <div className="flex items-center gap-4">
                              <Button
                                  variant="ghost"
                                  size="sm"
                                  className="gap-2 text-muted-foreground hover:text-foreground"
                              >
                                <ThumbsUp className="h-3 w-3" />
                                좋아요
                              </Button>
                              {isLoggedIn && (
                                  <Button
                                      variant="ghost"
                                      size="sm"
                                      className="gap-2 text-muted-foreground hover:text-foreground"
                                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                  >
                                    <Reply className="h-3 w-3" />
                                    답글
                                  </Button>
                              )}
                            </div>

                            {/* Reply Form */}
                            {replyingTo === comment.id && (
                                <div className="mt-4 pl-4 border-l-2 border-muted">
                                  <div className="flex items-start gap-3">
                                    <Avatar className="w-8 h-8">
                                      <AvatarImage
                                          src={userInfo?.profileImage || "/placeholder.svg"}
                                          alt={userInfo?.nickname}
                                      />
                                      <AvatarFallback>{userInfo?.nickname?.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 space-y-3">
                                      <Textarea
                                          placeholder="답글을 작성해주세요..."
                                          value={replyContent}
                                          onChange={(e) => setReplyContent(e.target.value)}
                                          className="min-h-[80px] resize-none"
                                      />
                                      <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleReplySubmit(comment.id)}
                                            disabled={!replyContent.trim()}
                                            className="bg-foreground text-background hover:bg-foreground/90"
                                        >
                                          답글 작성
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              setReplyingTo(null)
                                              setReplyContent("")
                                            }}
                                        >
                                          취소
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            )}

                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="mt-4 pl-4 border-l-2 border-muted space-y-4">
                                  {comment.replies.map((reply) => (
                                      <div key={reply.id} className="flex items-start gap-3">
                                        <Avatar className="w-8 h-8">
                                          <AvatarImage src={reply.avatar || "/placeholder.svg"} alt={reply.author} />
                                          <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-3 mb-1">
                                            <span className="font-semibold text-sm">{reply.author}</span>
                                            <span className="text-xs text-muted-foreground">{reply.createdAt}</span>
                                          </div>
                                          <p className="text-sm text-foreground leading-relaxed">{reply.content}</p>
                                        </div>
                                      </div>
                                  ))}
                                </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
