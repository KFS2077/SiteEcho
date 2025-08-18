"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Trash2, Search, BarChart3, Settings, Monitor, Sun, Moon } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { translations, type Language } from "@/lib/translations"
import { FancyPageTransition } from "@/components/page-transition"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
  const { theme, setTheme } = useTheme()

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
        (item: PreviewData) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.keywords.some((keyword: string) => keyword.toLowerCase().includes(searchTerm.toLowerCase())),
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
    const newHistory = history.filter((_: PreviewData, i: number) => i !== index)
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

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("siteecho-language", newLanguage)
  }

  const t = translations[language]

  return (
    <FancyPageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              {/* Logo and Title */}
              <Link href="/" className="block">
                <motion.div className="flex items-center gap-4 cursor-pointer" whileHover={{ scale: 1.02 }}>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <BarChart3 className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 font-sans">URLinsights</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {t.analysisHistory} - {history.length} {t.websitesAnalyzed}
                    </p>
                  </div>
                </motion.div>
              </Link>

              {/* History Search */}
              <div className="flex-1 max-w-2xl mx-8">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={t.searchHistory}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 h-14 text-base border-slate-300 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl shadow-lg bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-slate-900 dark:text-slate-100"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              {/* Clear History Button and Settings */}
              <div className="flex items-center gap-4">
                {history.length > 0 && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      onClick={clearHistory}
                      className="h-14 px-6 border-slate-300 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl font-semibold bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm shadow-lg text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {t.clearAll}
                    </Button>
                  </motion.div>
                )}
                
                {/* Settings Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-14 w-14 p-0 bg-transparent border-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 rounded-2xl transition-all duration-200"
                      aria-label="Settings"
                    >
                      <Settings className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="text-xs uppercase tracking-wider text-slate-500">Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuLabel>{t.language}</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={language} onValueChange={(val) => handleLanguageChange(val as Language)}>
                      <DropdownMenuRadioItem value="en">{t.english}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="es">{t.spanish}</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuLabel>Theme</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={(val) => setTheme(val)}>
                      <DropdownMenuRadioItem value="light"><Sun className="w-4 h-4 mr-2" />{t.lightMode}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="dark"><Moon className="w-4 h-4 mr-2" />{t.darkMode}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="system"><Monitor className="w-4 h-4 mr-2" />System</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </motion.header>

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
