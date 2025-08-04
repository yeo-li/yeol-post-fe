import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container px-4 md:px-6 lg:px-8 py-12 md:py-20 lg:py-32 max-w-6xl mx-auto">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-bold text-muted-foreground/20 mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">페이지를 찾을 수 없습니다</h2>
          <p className="text-muted-foreground mb-8">요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/">
            <Button size="lg" className="gap-2 bg-foreground text-background hover:bg-foreground/90">
              <Home className="h-4 w-4" />
              홈으로 돌아가기
            </Button>
          </Link>
          <Link href="/posts">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
            >
              <Search className="h-4 w-4" />
              전체 글 보기
            </Button>
          </Link>
        </div>

        {/* Popular Links */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">인기 페이지</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/categories/development"
                className="p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium">개발</span>
                </div>
              </Link>
              <Link
                href="/categories/design"
                className="p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="font-medium">디자인</span>
                </div>
              </Link>
              <Link
                href="/categories/lifestyle"
                className="p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="font-medium">일상</span>
                </div>
              </Link>
              <Link href="/about" className="p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-muted"></div>
                  <span className="font-medium">소개</span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
