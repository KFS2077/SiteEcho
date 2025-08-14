"use client"

import { Card } from "@/components/ui/card"
import { Tag, Sparkles } from "lucide-react"
import { useState } from "react"

interface KeywordsPanelProps {
  keywords: string[]
  isLoading?: boolean
}

export function KeywordsPanel({ keywords, isLoading }: KeywordsPanelProps) {
  const [hoveredKeyword, setHoveredKeyword] = useState<string | null>(null)

  if (isLoading) {
    return (
      <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
        <div className="gradient-emerald p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-white/20 rounded w-32 mb-2"></div>
            <div className="h-4 bg-white/10 rounded w-48"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="flex flex-wrap gap-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 dark:bg-slate-700 rounded-full w-20"></div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (keywords.length === 0) {
    return (
      <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
        <div className="gradient-emerald p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif font-black text-white text-lg">Keyword Insights</h3>
              <p className="text-emerald-100 text-sm font-medium">Discover the potential of your keywords</p>
            </div>
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
          </div>
          <p className="text-gray-600 dark:text-slate-300 font-medium">Keywords will appear here after analyzing the website</p>
        </div>
      </Card>
    )
  }

  const getKeywordStyle = (keyword: string, index: number) => {
    const sizes = ["text-xs", "text-sm", "text-base", "text-lg"]
    const colors = [
      "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200 hover:shadow-md",
      "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 hover:shadow-md",
      "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 hover:shadow-md",
      "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200 hover:shadow-md",
      "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200 hover:shadow-md",
    ]

    const sizeIndex = Math.floor(Math.random() * sizes.length)
    const colorIndex = index % colors.length

    return {
      size: sizes[sizeIndex],
      color: colors[colorIndex],
    }
  }

  return (
    <Card className="border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg rounded-2xl overflow-hidden">
      <div className="gradient-emerald p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif font-black text-white text-lg">Keyword Insights</h3>
              <p className="text-emerald-100 text-sm font-medium">Track performance, volume, and trends</p>
            </div>
          </div>
          <div className="bg-white/25 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
            <span className="text-sm text-white font-bold">{keywords.length} keywords</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {keywords.map((keyword, index) => {
            const style = getKeywordStyle(keyword, index)
            return (
              <button
                key={index}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300 transform hover:scale-105 ${style.color} ${style.size} font-medium dark:shadow-none`}
                onMouseEnter={() => setHoveredKeyword(keyword)}
                onMouseLeave={() => setHoveredKeyword(null)}
                onClick={() => {
                  navigator.clipboard.writeText(keyword)
                }}
              >
                <Tag className="w-3 h-3" />
                {keyword}
                {hoveredKeyword === keyword && (
                  <span className="text-xs opacity-75 ml-1 font-normal">click to copy</span>
                )}
              </button>
            )
          })}
        </div>

        {keywords.length > 10 && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">Click any keyword to copy • Hover for interactions</p>
          </div>
        )}
      </div>
    </Card>
  )
}
