import { Loader2 } from "lucide-react"

export default function Loading() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">임시저장 목록을 불러오는 중...</p>
            </div>
        </div>
    )
}
