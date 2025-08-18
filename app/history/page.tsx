"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Trash2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { translations, type Language } from "@/lib/translations"
import { FancyPageTransition } from "@/components/page-transition"

interface PreviewData {
  url: string
  title: string
  description: string
  favicon: string
  screenshot: string
  timestamp: Date
  keywords: string[]
}

export default function HistoryPage() {
  const [history, setHistory] = useState<PreviewData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredHistory, setFilteredHistory] = useState<PreviewData[]>([])
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem("siteecho-language") as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }

    // Load history from localStorage
    const savedHistory = localStorage.getItem("webanalyzer-history")
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }))
      setHistory(parsed)
      setFilteredHistory(parsed)
    }
  }, [])

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = history.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setFilteredHistory(filtered)
    } else {
      setFilteredHistory(history)
    }
  }, [searchTerm, history])

  const clearHistory = () => {
    setHistory([])
    setFilteredHistory([])
    localStorage.removeItem("webanalyzer-history")
  }

  const deleteItem = (index: number) => {
    const newHistory = history.filter((_, i) => i !== index)
    setHistory(newHistory)
    localStorage.setItem("webanalyzer-history", JSON.stringify(newHistory))
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const t = translations[language]

  return (
    <FancyPageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100">
                  <ArrowLeft className="w-4 h-4" />
                  {t?.back || "Back"}
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-emerald-600" />
                <div>
                  <h1 className="text-2xl font-black text-gray-900 dark:text-slate-100 font-serif">{t.analysisHistory}</h1>
                  <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">{history.length} {t.websitesAnalyzed}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t.searchHistory}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 rounded-xl"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
              </div>
              {history.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearHistory}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                  {t.clearAll}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-2">
              {searchTerm ? t.noMatchingResults ?? "No matching results" : t.noHistoryYet}
            </h3>
            <p className="text-gray-500 dark:text-slate-400 mb-6">
              {searchTerm ? t.tryAdjustSearch ?? "Try adjusting your search terms" : t.startAnalyzing}
            </p>
            <Link href="/">
              <Button className="bg-emerald-600 hover:bg-emerald-700">{t.analyze}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="aspect-video bg-gray-100 dark:bg-slate-700 relative">
                  <img
                    src={item.screenshot || "/placeholder.svg"}
                    alt={`Screenshot of ${item.title}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/generic-website-screenshot.png"
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteItem(index)}
                    className="absolute top-2 right-2 bg-white/80 dark:bg-slate-700/80 hover:bg-white dark:hover:bg-slate-600 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={item.favicon || "/placeholder.svg"}
                      alt="Favicon"
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = "/generic-website-icon.png"
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-slate-100 truncate mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{item.url}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-slate-300 mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.keywords.slice(0, 3).map((keyword, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                    {item.keywords.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        {"+"}{item.keywords.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-slate-400">{formatDate(item.timestamp)}</span>
                    <Link href={`/?url=${encodeURIComponent(item.url)}`}>
                      <Button size="sm" variant="outline" className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                        Re-analyze
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Back Arrow Button - Bottom Right */}
      <Link href="/">
        <Button
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-700 transition-all duration-200 z-50"
          size="icon"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </Button>
      </Link>

      </div>
    </FancyPageTransition>
  )
}
