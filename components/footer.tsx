import { Github, Twitter, Mail, Heart } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-base md:text-lg">소개</h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              개발과 디자인에 관심이 많은 블로거입니다. 일상의 작은 발견들을 글로 기록하며, 더 나은 웹을 만들기 위해
              노력하고 있습니다.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 md:mb-4 text-base md:text-lg">둘러보기</h3>
            <div className="space-y-2 md:space-y-3 text-sm md:text-base">
              <Link href="/" className="block text-muted-foreground hover:text-foreground">
                홈
              </Link>
              <Link href="/about" className="block text-muted-foreground hover:text-foreground">
                소개
              </Link>
              <Link href="/categories" className="block text-muted-foreground hover:text-foreground">
                카테고리
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">연결</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-6 md:mt-8 lg:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center text-sm md:text-base text-muted-foreground gap-3 md:gap-0">
          <p>© 2024 김블로거. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500" /> and Next.js
          </p>
        </div>
      </div>
    </footer>
  )
}
