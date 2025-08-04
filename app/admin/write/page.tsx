"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useTheme } from "next-themes"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Upload, X, Loader2, Lock, AlertTriangle, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
    fetchPost,
    fetchSavePost,
    fetchUpdatePost,
    fetchLoginInformation,
    deletePost,
    fetchSaveDraftPost, fetchPublishDraftPost, fetchUpdateDraftPost, fetchCategoriesAndPostsCount
} from "@/lib/api"

// MDEditor를 동적으로 로드 (SSR 방지)
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

// const categories = [
//     { id: 1, name: "개발" },
//     { id: 2, name: "디자인" },
//     { id: 3, name: "일상" },
//     { id: 4, name: "리뷰" },
// ]

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

function PostWriteContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const postId = searchParams.get("id")
    const isEditMode = !!postId
    const { theme } = useTheme()

    // 로그인 상태 관리
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
    const [userInfo, setUserInfo] = useState<any>(null)

    // 게시물 상태 관리
    const [postData, setPostData] = useState<Post | null>(null)
    const [isDraftMode, setIsDraftMode] = useState(false) // 임시저장 모드인지 확인
    const [post_id, setPost_id] = useState<number | null>(null)

    // 폼 상태
    const [title, setTitle] = useState("")
    const [summary, setSummary] = useState("")
    const [content, setContent] = useState("")
    const [category, setCategory] = useState<number | undefined>(undefined)
    const [author, setAuthor] = useState("")
    const [tagInput, setTagInput] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [categories, setCategories] = useState([])

    // 변경사항 추적
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [initialData, setInitialData] = useState<any>(null)
    const [showExitDialog, setShowExitDialog] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)

    // 에디터 관련
    const editorContainerRef = useRef<HTMLDivElement>(null)
    const [editorHeight, setEditorHeight] = useState<number | undefined>(undefined)
    const [previewMode, setPreviewMode] = useState<"live" | "edit">("live")

    const [adminName, setAdminName] = useState("서여")
    const [adminId, setAdminId] = useState(1)


    // 변경사항 감지 함수
    const checkForChanges = () => {
        if (!initialData) return false

        const currentData = {
            title: title.trim(),
            summary: summary.trim(),
            content: content.trim(),
            category,
            author: author.trim(),
            tags: [...tags].sort(),
        }

        const hasChanged =
            currentData.title !== initialData.title ||
            currentData.summary !== initialData.summary ||
            currentData.content !== initialData.content ||
            Number(currentData.category ?? -1) !== Number(initialData.category ?? -1) ||
            currentData.author !== initialData.author ||
            JSON.stringify(currentData.tags) !== JSON.stringify(initialData.tags)

        setHasUnsavedChanges(hasChanged)
        return hasChanged
    }

    useEffect(() => {
        // 모든 카테고리를 가져옴
        const loadData = async () => {
            const categories = await fetchCategoriesAndPostsCount();
            setCategories(categories)
        }
        loadData();
    }, []);

    // 폼 데이터 변경 시 변경사항 체크
    useEffect(() => {
        checkForChanges()
    }, [title, summary, content, category, author, tags, initialData])

    // 페이지 이탈 방지
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault()
                e.returnValue = "작업이 완료되지 않았습니다. 정말 페이지를 벗어나시겠습니까?"
                return e.returnValue
            }
        }

        const handlePopState = (e: PopStateEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault()
                setShowExitDialog(true)
                setPendingNavigation("back")
                // 브라우저 히스토리를 원래 상태로 복원
                window.history.pushState(null, "", window.location.href)
            }
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        window.addEventListener("popstate", handlePopState)

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload)
            window.removeEventListener("popstate", handlePopState)
        }
    }, [hasUnsavedChanges])

    // 로그인 확인 및 데이터 로드
    useEffect(() => {

        const checkLoginAndLoadData = async () => {
            setIsLoading(true)
            try {
                // 1. 로그인 확인
                const loginInfo = await fetchLoginInformation()

                if (!loginInfo?.isLoggedIn) {
                    setIsLoggedIn(false)
                    setIsLoading(false)
                    return
                }

                setIsLoggedIn(true)
                setUserInfo(loginInfo.user)
                setAdminName(loginInfo.user.nickname || "서여")
                setAdminId(loginInfo.user.admin_id || 1)

                // 2. 수정 모드일 때 게시물 데이터 로드
                if (isEditMode) {
                    if (postId) {
                        console.log("게시물 로딩 시작, postId:", postId)

                        const postData = await fetchPost({ postId: Number(postId) })
                        console.log("로드된 게시물 데이터:", postData)

                        if (postData) {
                            setPostData(postData)
                            setIsDraftMode(!postData.is_published) // 임시저장 모드 설정

                            const loadedTitle = postData.title || ""
                            const loadedSummary = postData.summary || ""
                            const loadedContent = postData.content || ""
                            const loadedAuthor = postData.author || ""
                            const loadedTags: string[] = Array.from(new Set(postData.tags || []))

                            setTitle(loadedTitle)
                            setSummary(loadedSummary)
                            setContent(loadedContent)
                            setAuthor(loadedAuthor)
                            setTags(loadedTags)

                            // --- REFACTOR: category state and initialData.category logic ---
                            const loadedCategoryId = postData.category?.category_id;
                            if (loadedCategoryId !== undefined && loadedCategoryId !== category) {
                                setCategory(loadedCategoryId);
                            }
                            setInitialData({
                                title: loadedTitle,
                                summary: loadedSummary,
                                content: loadedContent,
                                category: loadedCategoryId,
                                author: loadedAuthor,
                                tags: [...loadedTags].sort(),
                            })
                            // --- END REFACTOR ---
                        } else {
                            console.error("게시물을 찾을 수 없습니다.")
                            alert("게시물을 찾을 수 없습니다.")
                            router.push("/admin")
                        }
                    }
                } else {
                    // 새 게시물 작성 모드일 때 초기 데이터 설정
                    setInitialData({
                        title: "",
                        summary: "",
                        content: "",
                        category: undefined,
                        author: "",
                        tags: [],
                    })
                }
            } catch (error) {
                console.error("데이터 로딩 실패:", error)
                setIsLoggedIn(false)
                if (isEditMode) {
                    alert("게시물을 불러오는 중 오류가 발생했습니다.")
                    router.push("/admin")
                }
            } finally {
                setIsLoading(false)
            }
        }

        checkLoginAndLoadData()
    }, [isEditMode, postId, router])

    useEffect(() => {
        // 원래 제목 저장
        const originalTitle = document.title

        // 작성중 제목으로 변경
        document.title = `(작성중) ${originalTitle}`

        // 컴포넌트 언마운트 시 원래 제목으로 복원
        return () => {
            document.title = originalTitle
        }
    }, [])

    // 에디터 높이 계산
    useEffect(() => {
        const calculateHeight = () => {
            const containerTop = editorContainerRef.current?.getBoundingClientRect().top ?? 0
            setEditorHeight(window.innerHeight - containerTop - 20)
        }

        calculateHeight()
        window.addEventListener("resize", calculateHeight)
        return () => window.removeEventListener("resize", calculateHeight)
    }, [])

    useEffect(() => {
        const id = searchParams.get('postId');
        if (id) setPost_id(Number(id));
    }, [searchParams]);

    // 반응형 프리뷰 모드
    useEffect(() => {
        const updatePreviewMode = () => {
            setPreviewMode(window.innerWidth >= 768 ? "live" : "edit")
        }
        updatePreviewMode()
        window.addEventListener("resize", updatePreviewMode)
        return () => window.removeEventListener("resize", updatePreviewMode)
    }, [])

    const addTag = () => {
        if (tagInput.trim() && tags.length < 10 && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()])
            setTagInput("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addTag()
        }
    }

    // 저장/수정 로직 분리
    const handleSave = async (asDraft = false) => {
        if (!title.trim()) {
            alert("제목을 입력해주세요.")
            return
        }

        setIsSaving(true)

        const postData = {
            title: title.trim(),
            summary: summary.trim(),
            content: content.trim(),
            category_id: category,
            author: author.trim() || adminName || "서여",
            admin_id: adminId,
            tags: tags,
            is_published: !asDraft, // 임시저장이면 false, 출간이면 true
        }

        try {
            if (isEditMode && postId) {
                // 수정 모드: PATCH 요청
                setTimeout(async () => {
                    setIsSaving(false)
                    setHasUnsavedChanges(false)
                    if (asDraft) {
                        await fetchUpdateDraftPost(Number(postId), postData);
                        alert("임시저장되었습니다!")
                    } else {
                        if (isDraftMode) {
                            await fetchUpdateDraftPost(Number(postId), postData);
                            await fetchPublishDraftPost(Number(postId));
                            alert("게시물이 출간되었습니다!")
                            router.push("/admin");
                        } else {
                            await fetchUpdatePost(Number(postId), postData);
                            alert("게시물이 수정되었습니다!");
                            router.back();
                        }
                    }
                }, 0)
            } else {
                // 새 게시물 작성 모드: POST 요청
                console.log("생성:", postData)

                setTimeout(async () => {
                    setIsSaving(false)
                    setHasUnsavedChanges(false) // 저장 완료 후 변경사항 플래그 리셋
                    if (asDraft) {
                        if(postId == null) {
                            const response = await fetchSaveDraftPost(postData);
                            alert("임시저장되었습니다!")
                            // 임시 저장 후 /admin/write?id={postId}로 라우트
                            router.push("/admin/write?postId=" + response.post_id);
                        } else {
                            // update 로직 을 안만들어도되네? 왜지
                        }
                    } else {
                        // await fetchPublishDraftPost(postData);
                        await fetchSavePost(postData);
                        alert("게시물이 출간되었습니다!")
                        router.push("/admin")
                    }
                })
            }
        } catch (error) {
            setIsSaving(false)
            alert("저장 중 오류가 발생했습니다.")
        }
    }

    // 삭제 처리
    const handleDelete = async () => {
        if (!postId) return

        setIsDeleting(true)
        try {
            await deletePost(Number(postId))
            console.log("게시물 삭제 완료:", postId)

            setIsDeleting(false)
            setShowDeleteDialog(false)
            setHasUnsavedChanges(false) // 삭제 후 변경사항 플래그 리셋

            if (isDraftMode) {
                alert("임시저장 글이 성공적으로 삭제되었습니다.")
                router.push("/admin/drafts")
            } else {
                alert("게시물이 성공적으로 삭제되었습니다.")
                router.push("/admin")
            }
        } catch (error) {
            setIsDeleting(false)
            console.error("삭제 실패:", error)
            alert("게시물 삭제 중 오류가 발생했습니다. 다시 시도해주세요.")
        }
    }

    // 페이지 이탈 확인 다이얼로그 처리
    const handleExitConfirm = () => {
        setHasUnsavedChanges(false) // 강제로 변경사항 플래그 리셋
        setShowExitDialog(false)

        if (pendingNavigation === "back") {
            window.history.back()
        } else if (pendingNavigation) {
            router.push(pendingNavigation)
        }
        setPendingNavigation(null)
    }

    const handleExitCancel = () => {
        setShowExitDialog(false)
        setPendingNavigation(null)
    }

    // 커스텀 네비게이션 핸들러
    const handleNavigation = (path: string) => {
        if (hasUnsavedChanges) {
            setShowExitDialog(true)
            setPendingNavigation(path)
        } else {
            router.push(path)
        }
    }

    // 로딩 중일 때 표시할 화면
    if (isLoading) {
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

    // 페이지 제목과 설명 결정
    const getPageInfo = () => {
        if (isEditMode) {
            if (isDraftMode) {
                return {
                    title: "임시저장 글 계속 작성",
                    description: "임시저장된 글을 계속 작성하거나 출간할 수 있습니다.",
                    backUrl: "/admin/drafts",
                }
            } else {
                return {
                    title: "게시물 수정",
                    description: "출간된 게시물을 수정할 수 있습니다.",
                    backUrl: "/admin",
                }
            }
        } else {
            return {
                title: "새 게시물 작성",
                description: "새로운 게시물을 작성하고 출간하거나 임시저장할 수 있습니다.",
                backUrl: "/admin",
            }
        }
    }

    const pageInfo = getPageInfo()

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b p-4">
                <div className="container max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => handleNavigation(pageInfo.backUrl)}
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            {isDraftMode ? "임시저장 목록으로 돌아가기" : "관리자 대시보드로 돌아가기"}
                        </button>
                        <div className="flex items-center gap-2">
                            {hasUnsavedChanges && (
                                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                    저장되지 않은 변경사항
                                </div>
                            )}
                            <div className="flex gap-2">
                                {/* Delete Button - Only show in edit mode */}
                                {isEditMode && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowDeleteDialog(true)}
                                        disabled={isSaving || isDeleting}
                                        className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        삭제
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => handleSave(true)}
                                    disabled={isSaving || isDeleting}
                                    className="gap-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white bg-transparent"
                                >
                                    <Save className="h-4 w-4" />
                                    {isSaving ? "저장 중..." : "임시저장"}
                                </Button>
                                <Button
                                    onClick={() => handleSave(false)}
                                    disabled={isSaving || isDeleting}
                                    className="gap-2 bg-foreground text-background hover:bg-foreground/90"
                                >
                                    <Upload className="h-4 w-4" />
                                    {isSaving ? "저장 중..." : isDraftMode ? "출간하기" : isEditMode ? "수정 완료" : "출간하기"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container max-w-7xl mx-auto">
                <div className="flex h-[calc(200vh-146px)] w-full">
                    {/* Editor Panel */}
                    <div className="flex-1 flex flex-col h-full">
                        {/* Post Info */}
                        <div className="p-4 md:p-6 border-b space-y-4">
                            <div className="flex items-center gap-3 mb-4">
                                <h1 className="text-xl md:text-2xl font-bold">{pageInfo.title}</h1>
                                <div className="flex items-center gap-2">
                                    {isEditMode && (
                                        <Badge variant="secondary" className="text-xs">
                                            ID: {postId}
                                        </Badge>
                                    )}
                                    {isDraftMode && (
                                        <Badge variant="outline" className="text-amber-600 border-amber-600">
                                            <Save className="h-3 w-3 mr-1" />
                                            임시저장
                                        </Badge>
                                    )}
                                    {isEditMode && !isDraftMode && (
                                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                                            출간됨
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{pageInfo.description}</p>

                            <textarea
                                placeholder="제목을 입력하세요"
                                value={title ?? ""}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-3xl md:text-4xl lg:text-5xl font-bold placeholder:text-muted-foreground/50 border-0 px-0 py-4 resize-none bg-transparent focus:outline-none focus:ring-0 leading-tight"
                                rows={1}
                                style={{
                                    minHeight: "60px",
                                    maxHeight: "200px",
                                    overflow: "hidden",
                                }}
                                onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement
                                    target.style.height = "auto"
                                    target.style.height = target.scrollHeight + "px"
                                }}
                            />

                            <Textarea
                                placeholder="게시물 요약을 입력하세요 (선택사항)"
                                value={summary ?? ""}
                                onChange={(e) => setSummary(e.target.value)}
                                className="resize-none border-0 px-0 focus-visible:ring-0 text-base md:text-lg placeholder:text-muted-foreground/50"
                                rows={3}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Select
                                    value={category?.toString() ?? ""}
                                    onValueChange={(v) => {
                                        if (v === "") {
                                            setCategory(undefined);
                                        } else {
                                            setCategory(Number(v));
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="카테고리 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.category_id} value={cat.category_id.toString()}>
                                                {cat.category_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Input
                                    placeholder={`작성자 (기본: ${adminName})`}
                                    value={author ?? ""}
                                    onChange={(e) => setAuthor(e.target.value)}
                                />

                                <div className="flex gap-2">
                                    <Input
                                        placeholder="태그 입력 (최대 10개)"
                                        value={tagInput ?? ""}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={tags.length >= 10}
                                    />
                                    <Button
                                        onClick={addTag}
                                        disabled={!tagInput.trim() || tags.length >= 10}
                                        className="bg-foreground text-background hover:bg-foreground/90"
                                    >
                                        추가
                                    </Button>
                                </div>
                            </div>

                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, index) => (
                                        <Badge key={`${tag}-${index}`} variant="secondary" className="gap-1">
                                            #{tag}
                                            <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Content Editor */}
                        <div ref={editorContainerRef} className="flex-1 h-full overflow-hidden p-0">
                            <div className="w-full h-full">
                                <MDEditor
                                    value={content}
                                    onChange={(v?: string) => setContent(v ?? "")}
                                    preview={previewMode}
                                    hideToolbar={true}
                                    textareaProps={{
                                        placeholder: "여기에 마크다운을 입력해보세요...",
                                    }}
                                    previewOptions={{
                                        className: "wmd-markdown bg-background text-foreground",
                                    }}
                                    className="w-full h-full bg-background wmde-markdown"
                                    height="100%"
                                />
                            </div>
                        </div>
                    </div>
                    {/* styled-jsx global to hide any <footer> */}
                    <style jsx global>{`
                        footer {
                            display: none !important;
                        }
                    `}</style>
                    <style jsx global>{`
                        /* Ensure live preview text uses theme foreground */
                        .w-md-editor .wmde-markdown-color,
                        .w-md-editor .wmde-markdown-color * {
                            // color: hsl(var(--foreground)) !important;
                        }
                        /* Ensure textarea input text uses theme foreground */
                        .w-md-editor-text-input textarea {
                            // color: hsl(var(--foreground)) !important;
                            background-color: hsl(var(--background)) !important;
                        }
                    `}</style>
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
                </div>
            </div>

            {/* 삭제 확인 다이얼로그 */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <DialogTitle className="text-lg">{isDraftMode ? "임시저장 글 삭제" : "게시물 삭제"}</DialogTitle>
                        </div>
                        <DialogDescription className="text-muted-foreground">
                            정말로 이 {isDraftMode ? "임시저장 글을" : "게시물을"} 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                            <br />
                            <span className="text-sm text-red-600 dark:text-red-400 mt-2 block font-medium">
                "{title}" {isDraftMode ? "임시저장 글이" : "게시물이"} 영구적으로 삭제됩니다.
              </span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
                            취소
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="gap-2">
                            {isDeleting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    삭제 중...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    삭제하기
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 페이지 이탈 확인 다이얼로그 */}
            <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <DialogTitle className="text-lg">작업이 완료되지 않았습니다</DialogTitle>
                        </div>
                        <DialogDescription className="text-muted-foreground">
                            저장하지 않은 변경사항이 있습니다. 정말 페이지를 벗어나시겠습니까?
                            <br />
                            <span className="text-sm text-amber-600 dark:text-amber-400 mt-2 block">
                변경사항은 저장되지 않습니다.
              </span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={handleExitCancel}>
                            취소
                        </Button>
                        <Button variant="destructive" onClick={handleExitConfirm} className="gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            나가기
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default function PostWritePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">로딩 중...</p>
                    </div>
                </div>
            }
        >
            <PostWriteContent />
        </Suspense>
    )
}
