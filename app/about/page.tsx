import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Mail } from "lucide-react"
import Link from "next/link";

const skills = [
  { name: "Spring", level: "초급" },
  { name: "Next.js", level: "초급" },
  { name: "Node.js", level: "초급" },
]

const experiences = [
  {
    title: "컴퓨터공학 전공",
    company: "세종대학교",
    period: "2021 - 현재",
    description: "컴퓨터공학과 재학중",
  },
]

export default function AboutPage() {
  return (
    <div className="container px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12 max-w-7xl mx-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <p className="text-sm text-muted-foreground mb-2">About</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">안녕하세요, 박성열입니다.</h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            아키텍트가 되고 싶은 백엔드 개발자 지망생입니다. 더 견고한 웹을 만들기 위해 노력하고 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* About Me */}
            <Card>
              <CardHeader>
                <CardTitle>저에 대해</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  궁금해 하십시오.
                </p>
                <p>

                </p>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">관심 분야</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                  {skills.map((skill) => (
                    <div key={skill.name} className="flex flex-col items-center p-3 md:p-4 border rounded-lg">
                      <span className="font-medium text-sm md:text-base text-center">{skill.name}</span>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {skill.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle>경력</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        {index < experiences.length - 1 && <div className="w-px h-16 bg-border mt-2"></div>}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{exp.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exp.company} • {exp.period}
                        </p>
                        <p className="text-sm mt-1">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">연락처</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4">
                <Link href={`mailto:uio6699@naver.com`}>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">uio6699@naver.com</span>
                </div>
                </Link>
                <div className="flex items-center gap-3">
                  <Github className="h-4 w-4" />
                  <Link href="https://github.com/yeo-li"><span className="text-sm">GitHub</span></Link>
                </div>
              </CardContent>
            </Card>

            {/* Blog Stats */}
            <Card>
              <CardHeader>
                <CardTitle>블로그 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">아직 준비중입니다.</div>
                {/*<div className="flex justify-between">*/}
                {/*  <span className="text-sm text-muted-foreground">총 포스트</span>*/}
                {/*  <span className="font-semibold">28개</span>*/}
                {/*</div>*/}
                {/*<div className="flex justify-between">*/}
                {/*  <span className="text-sm text-muted-foreground">카테고리</span>*/}
                {/*  <span className="font-semibold">4개</span>*/}
                {/*</div>*/}
                {/*<div className="flex justify-between">*/}
                {/*  <span className="text-sm text-muted-foreground">블로그 시작</span>*/}
                {/*  <span className="font-semibold">2023년</span>*/}
                {/*</div>*/}
              </CardContent>
            </Card>

            {/* Contact CTA */}
            <Card>
              <CardHeader>
                <CardTitle>함께 소통해요</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  궁금한 점이 있거나 함께 이야기하고 싶은 주제가 있다면 언제든 연락주세요.
                </p>
                <Link href={`mailto:uio6699@naver.com`}>
                <Button className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90">
                  <Mail className="h-4 w-4" />
                  메일 보내기
                </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
