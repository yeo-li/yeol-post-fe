"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import {
  Search,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Plus,
  FileText,
  FolderOpen,
  Settings,
  Loader2,
  Lock,
  Save,
  Menu,
} from "lucide-react"
import { fetchAllPosts, deletePost, fetchLoginInformation } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"

const sidebarItems = [
  { icon: FileText, label: "포스트 관리", active: true, href: "/admin" },
  { icon: Save, label: "임시저장 목록", active: false, href: "/admin/drafts" },
  { icon: FolderOpen, label: "카테고리", href: "/admin/categories" },
  { icon: Settings, label: "설정", href: "/admin/settings" },
]

// API 응답 타입 정의
interface Category {
  category_id: number
  category_name: string
  post_count: number
}

interface Post {
  postId: number
  title: string
  summary: string
  author: string
  content: string
  published_at: string
  category: Category
  tags: string[]
  is_published: boolean
}

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
  const wordsPerMinute = 200
  const wordCount = content.length / 2 // 한글 기준 대략적 계산
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime}분`
}

const SidebarContent = ({ userInfo, onNavigate }: { userInfo: any, onNavigate: (path: string) => void }) => (
    <div>
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
                    onClick={() => onNavigate(item.href)}
                >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                </Button>
            ))}
        </nav>
    </div>
);


export default function AdminPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // 로그인 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [userInfo, setUserInfo] = useState<any>(null)

  // 로그인 확인 및 게시물 목록 불러오기
  useEffect(() => {
    checkLoginAndLoadData()
  }, [])

  const checkLoginAndLoadData = async () => {
    setLoading(true)
    try {
      // 1. 로그인 확인
      const loginInfo = await fetchLoginInformation()

      if (!loginInfo?.isLoggedIn) {
        setIsLoggedIn(false)
        setLoading(false)
        return
      }

      setIsLoggedIn(true)
      setUserInfo(loginInfo.user)

      // 2. 로그인되어 있으면 게시물 목록 로드 (출간된 글만 필터링)
      const postsData = await fetchAllPosts()
      // const publishedPosts = (postsData || []).filter((post: Post) => post.is_published)
      const publishedPosts = (postsData || [])
      setPosts(publishedPosts)
    } catch (error) {
      console.error("데이터 로딩 실패:", error)
      setIsLoggedIn(false)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  // 로그인 확인 중 로딩 화면
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

  // 검색 필터링
  const filteredPosts = posts.filter(
      (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category.category_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleNewPost = () => {
    router.push("/admin/write")
  }

  const handleEditPost = (postId: number) => {
    router.push(`/admin/write?id=${postId}`)
  }

  const handleViewPost = (postId: number) => {
    router.push(`/posts/${postId}`)
  }

  const handleDeleteClick = (post: Post) => {
    setPostToDelete(post)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return

    setDeleting(true)
    try {
      const result = await deletePost(postToDelete.postId)
      console.log("삭제 결과:", result)

      // 성공적으로 삭제되면 목록에서 제거
      setPosts(posts.filter((post) => post.postId !== postToDelete.postId))
      setDeleteDialogOpen(false)
      setPostToDelete(null)

      alert("게시물이 성공적으로 삭제되었습니다.")
    } catch (error) {
      console.error("삭제 실패:", error)
      alert("게시물 삭제 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setDeleting(false)
    }
  }

  const handleNavigation = (path: string) => {
      router.push(path);
      setIsDrawerOpen(false);
  }

  return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar for Desktop */}
          <div className="hidden lg:flex lg:w-64 border-r bg-muted/10 p-4 md:p-6 flex-col">
            <SidebarContent userInfo={userInfo} onNavigate={handleNavigation} />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 md:mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsDrawerOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold">포스트 관리</h1>
                        <p className="text-sm md:text-base text-muted-foreground">{posts.length}개의 출간된 포스트가 있습니다</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="포스트 제목, 카테고리, 작성자, 태그로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleNewPost} className="gap-2 bg-foreground text-background hover:bg-foreground/90">
                  <FileText className="h-4 w-4" />새 글 작성
                </Button>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">
                        {searchQuery ? "검색 결과가 없습니다" : "출간된 게시물이 없습니다"}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery ? "다른 검색어로 시도해보세요." : "첫 번째 게시물을 작성해보세요!"}
                      </p>
                      {!searchQuery && (
                          <Button
                              onClick={handleNewPost}
                              className="gap-2 bg-foreground text-background hover:bg-foreground/90"
                          >
                            <Plus className="h-4 w-4" />새 포스트 작성
                          </Button>
                      )}
                    </CardContent>
                  </Card>
              ) : (
                  filteredPosts.map((post) => (
                      <Card key={post.postId} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1 md:mb-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                  출간됨
                                </Badge>
                                <Badge variant="secondary">{post.category.category_name}</Badge>
                                <div className="flex items-center text-xs text-muted-foreground gap-4 flex-wrap">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(post.published_at)}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {calculateReadTime(post.content)}
                                  </span>
                                  <span className="text-muted-foreground">작성자: {post.author}</span>
                                </div>
                              </div>
                              <h3 className="font-semibold mb-2 line-clamp-1">{post.title}</h3>
                              {post.summary && (
                                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.summary}</p>
                              )}
                              <div className="flex flex-wrap gap-1">
                                {post.tags.map((tag, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      #{tag}
                                    </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 self-end md:self-auto md:ml-4">
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-muted"
                                  onClick={() => handleViewPost(post.postId)}
                                  title="게시물 보기"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-muted"
                                  onClick={() => handleEditPost(post.postId)}
                                  title="게시물 수정"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive hover:bg-muted"
                                  onClick={() => handleDeleteClick(post)}
                                  title="게시물 삭제"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                  ))
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
              <Card>
                <CardContent className="p-3 md:p-4 lg:p-6 text-center">
                  <div className="text-xl md:text-2xl lg:text-3xl font-bold mb-1">{posts.length}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">출간된 포스트</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{posts.reduce((acc, post) => acc + post.tags.length, 0)}</div>
                  <div className="text-sm text-muted-foreground">총 태그</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(posts.reduce((acc, post) => acc + post.content.length, 0) / posts.length / 200) || 0}분
                  </div>
                  <div className="text-sm text-muted-foreground">평균 읽기 시간</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Sidebar */}
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerContent>
                <div className="p-4">
                    <SidebarContent userInfo={userInfo} onNavigate={handleNavigation} />
                </div>
            </DrawerContent>
        </Drawer>

        {/* 삭제 확인 다이얼로그 */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>게시물 삭제</DialogTitle>
              <DialogDescription>정말로 이 게시물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
            </DialogHeader>

            {postToDelete && (
                <div className="my-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">{postToDelete.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">{postToDelete.category.category_name}</Badge>
                    <span>작성자: {postToDelete.author}</span>
                  </div>
                </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
                취소
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleting} className="gap-2">
                {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      삭제 중...
                    </>
                ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      삭제
                    </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
  )
}
