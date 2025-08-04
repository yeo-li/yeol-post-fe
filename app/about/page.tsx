import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Mail } from "lucide-react"

const skills = [
  { name: "React", level: "고급" },
  { name: "Next.js", level: "고급" },
  { name: "TypeScript", level: "중급" },
  { name: "Tailwind CSS", level: "고급" },
  { name: "Node.js", level: "중급" },
  { name: "UI/UX Design", level: "중급" },
  { name: "Web Performance", level: "중급" },
  { name: "Accessibility", level: "중급" },
  { name: "Design Systems", level: "중급" },
]

const experiences = [
  {
    title: "프론트엔드 개발자",
    company: "스타트업",
    period: "2022 - 현재",
    description: "React, Next.js를 사용한 웹 애플리케이션 개발",
  },
  {
    title: "웹 디자이너",
    company: "에이전시",
    period: "2020 - 2022",
    description: "UI/UX 디자인, 웹사이트 기획 및 제작",
  },
  {
    title: "컴퓨터공학 전공",
    company: "대학교",
    period: "2016 - 2020",
    description: "컴퓨터공학 학사 학위 취득",
  },
]

export default function AboutPage() {
  return (
    <div className="container px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12 max-w-7xl mx-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <p className="text-sm text-muted-foreground mb-2">About</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">안녕하세요, 김블로거입니다</h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            개발과 디자인에 관심이 많은 블로거입니다. 일상의 작은 발견들을 글로 기록하며, 더 나은 웹을 만들기 위해
            노력하고 있습니다.
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
                  웹 개발과 디자인에 관심이 많은 블로거입니다. 새로운 기술을 배우고 이를 실제 프로젝트에 적용하는 것을
                  좋아하며, 사용자 경험을 개선하는 일에 열정을 가지고 있습니다.
                </p>
                <p>
                  이 블로그에서는 제가 배운 것들, 경험한 것들, 그리고 일상의 작은 발견들을 글로 기록하고 있습니다. 더
                  나은 웹을 만들기 위한 여정을 함께 해주세요.
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
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">hello@blogger.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Github className="h-4 w-4" />
                  <span className="text-sm">GitHub</span>
                </div>
                <div className="flex items-center gap-3">
                  <Twitter className="h-4 w-4" />
                  <span className="text-sm">Twitter</span>
                </div>
              </CardContent>
            </Card>

            {/* Blog Stats */}
            <Card>
              <CardHeader>
                <CardTitle>블로그 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">총 포스트</span>
                  <span className="font-semibold">28개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">카테고리</span>
                  <span className="font-semibold">4개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">블로그 시작</span>
                  <span className="font-semibold">2023년</span>
                </div>
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
                <Button className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90">
                  <Mail className="h-4 w-4" />
                  메일 보내기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
