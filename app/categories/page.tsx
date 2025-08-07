"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar } from 'lucide-react'
import Link from "next/link"
import { useEffect, useState } from "react"
import { fetchCategoriesAndPostsCount } from "@/lib/api"

// 카테고리별 색상 매핑 함수
const getCategoryColorClasses = (categoryColor: string) => {
  const colorMap: { [key: string]: { dot: string; badge: string; hover: string } } = {
    "#3B82F6": {
      dot: "bg-blue-500",
      badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
      hover: "group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50",
    },
    "#8B5CF6": {
      dot: "bg-purple-500",
      badge:
          "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
      hover: "group-hover:bg-purple-50 dark:group-hover:bg-purple-950/50",
    },
    "#10B981": {
      dot: "bg-green-500",
      badge: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
      hover: "group-hover:bg-green-50 dark:group-hover:bg-green-950/50",
    },
    "#F59E0B": {
      dot: "bg-amber-500",
      badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
      hover: "group-hover:bg-amber-50 dark:group-hover:bg-amber-950/50",
    },
    "#EF4444": {
      dot: "bg-red-500",
      badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
      hover: "group-hover:bg-red-50 dark:group-hover:bg-red-950/50",
    },
    "#EC4899": {
      dot: "bg-pink-500",
      badge: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300 dark:border-pink-800",
      hover: "group-hover:bg-pink-50 dark:group-hover:bg-pink-950/50",
    },
    "#6B7280": {
      dot: "bg-gray-500",
      badge: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800",
      hover: "group-hover:bg-gray-50 dark:group-hover:bg-gray-950/50",
    },
    "#06B6D4": {
      dot: "bg-cyan-500",
      badge: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800",
      hover: "group-hover:bg-cyan-50 dark:group-hover:bg-cyan-950/50",
    },
    "#84CC16": {
      dot: "bg-lime-500",
      badge: "bg-lime-50 text-lime-700 border-lime-200 dark:bg-lime-950 dark:text-lime-300 dark:border-lime-800",
      hover: "group-hover:bg-lime-50 dark:group-hover:bg-lime-950/50",
    },
    "#F97316": {
      dot: "bg-orange-500",
      badge:
          "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
      hover: "group-hover:bg-orange-50 dark:group-hover:bg-orange-950/50",
    },
  }

  return (
      colorMap[categoryColor] || {
        dot: "bg-gray-500",
        badge: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800",
        hover: "group-hover:bg-gray-50 dark:group-hover:bg-gray-950/50",
      }
  )
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCategoriesAndPostsCount()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    loadData()
  }, [])

  return (
      <div className="container px-4 md:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-sm text-muted-foreground mb-2">Categories</p>
            <h1 className="text-4xl font-bold mb-6">카테고리</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              관심 있는 주제별로 글들을 모아서 확인해보세요. 각 카테고리마다 다양한 내용의 글이 준비되어 있습니다.
            </p>
          </div>

          {/* Categories List */}
          <div className="space-y-8 mb-16">
            {categories.filter(cat => cat.post_count > 0).map((category) => {
              const colorClasses = getCategoryColorClasses(category.category_color)
              return (
                  <article
                      key={category.category_name}
                      className="group border-b border-border py-8 hover:bg-muted/30 transition-colors rounded-lg px-6"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Category Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                              className="w-3 h-3 rounded-full shadow-sm"
                              style={{ backgroundColor: category.category_color }}
                          ></div>
                          <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                            {category.category_name}
                          </h2>
                          <Badge variant="outline" className={colorClasses.badge}>
                            {category.post_count}개 글
                          </Badge>
                        </div>

                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {category.category_description || "이 카테고리에 대한 설명이 없습니다."}
                        </p>

                        {/* Latest Post */}
                        {category.latest_post && (
                            <div className="bg-muted/50 rounded-lg p-4 border-l-4" style={{ borderLeftColor: category.category_color }}>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Calendar className="h-4 w-4" />
                                <span>최신 글</span>
                                <span>•</span>
                                <span>{category.latest_post.published_at?.split("T")[0]}</span>
                              </div>
                              <p className="font-medium text-foreground">
                                {category.latest_post.title}
                              </p>
                            </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="lg:ml-6">
                        <Button
                            variant="outline"
                            className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                            asChild
                        >
                          <Link href={`/categories/${category.category_name.replace("/", "-")}`}>
                            <span>모든 글 보기</span>
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </article>
              )
            })}
          </div>

          {/* All Posts CTA */}
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">모든 글 보기</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              카테고리에 상관없이 모든 블로그 포스트를 시간순으로 확인하고 싶으시나요?
            </p>
            <Link href="/posts">
              <Button size="lg" className="gap-2">
                전체 글 목록 보기 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
  )
}
