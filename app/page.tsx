"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PreviewPane } from "@/components/preview-pane"
import { KeywordsSubpage } from "@/components/subpages/keywords-subpage"
import { SearchEngineSubpage } from "@/components/subpages/search-engine-subpage"
import { SimilarSitesSubpage } from "@/components/subpages/similar-sites-subpage"
import { Globe, BarChart3, Clock, Sparkles, ChevronLeft, ChevronRight, Settings, Monitor, Sun, Moon, Trash2, Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { translations, type Language } from "@/lib/translations"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// import { ThemeToggle } from "@/components/theme-toggle"

interface PreviewData {
  url: string
  title: string
  description: string
  favicon: string
  screenshot: string
  timestamp: Date
  keywords: string[]
}

const subpages = [
  {
    id: "keywords",
    title: "Keyword Insights",
    description: "Discover keywords and topics from the analyzed website",
    component: KeywordsSubpage,
    gradient: "from-emerald-500 to-teal-600",
    icon: "🔍",
  },
  {
    id: "search",
    title: "Within-site Search",
    description: "Search for specific content within the website using search engines",
    component: SearchEngineSubpage,
    gradient: "from-blue-500 to-indigo-600",
    icon: "🎯",
  },
  {
    id: "similar",
    title: "Similar Websites",
    description: "Find websites with similar content, keywords",
    component: SimilarSitesSubpage,
    gradient: "from-purple-500 to-pink-600",
    icon: "🌐",
  },
]

export default function HomePage() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentPreview, setCurrentPreview] = useState<PreviewData | null>(null)
  const [history, setHistory] = useState<PreviewData[]>([])
  const [hasAutoAnalyzed, setHasAutoAnalyzed] = useState(false)
  const [currentSubpage, setCurrentSubpage] = useState(0)
  const [language, setLanguage] = useState<Language>("en")
  
  // Page swapping states
  const [currentPage, setCurrentPage] = useState<'analyzer' | 'history'>('analyzer')
  const [isSwapping, setIsSwapping] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredHistory, setFilteredHistory] = useState<PreviewData[]>([])

  const { theme, setTheme } = useTheme()
  const searchParams = useSearchParams()

  const handlePreview = useCallback(
    async (urlToAnalyze?: string) => {
      const targetUrl = urlToAnalyze || url
      if (!targetUrl.trim()) return

      setIsLoading(true)

      try {
        const response = await fetch("/api/screenshot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url: targetUrl.trim() }),
        })

        if (!response.ok) {
          throw new Error("Failed to capture screenshot")
        }

        const data = await response.json()

        const newPreview: PreviewData = {
          url: targetUrl.trim(),
          title: data.title || new URL(targetUrl.trim()).hostname,
          description: data.description || `Website preview of ${new URL(targetUrl.trim()).hostname}`,
          favicon: data.favicon || "/website-favicon.png",
          screenshot: data.screenshot,
          timestamp: new Date(),
          keywords: data.keywords || [],
        }

        setCurrentPreview(newPreview)

        setHistory((prevHistory) => {
          const newHistory = [newPreview, ...prevHistory.slice(0, 9)]
          localStorage.setItem("webanalyzer-history", JSON.stringify(newHistory))
          return newHistory
        })
      } catch (error) {
        console.error("Error capturing screenshot:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [url],
  )

  useEffect(() => {
    const savedHistory = localStorage.getItem("webanalyzer-history")
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
        setHistory(parsed)
        setFilteredHistory(parsed)
      } catch (error) {
        console.error("Error loading history:", error)
      }
    }
  }, [])

  useEffect(() => {
    const savedLanguage = localStorage.getItem("siteecho-language") as Language

    if (savedLanguage && ["en", "es", "zh"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    const urlParam = searchParams.get("url")
    if (urlParam && !hasAutoAnalyzed && currentPage === 'analyzer') {
      setUrl(urlParam)
      setHasAutoAnalyzed(true)
      handlePreview(urlParam)
    }
  }, [searchParams, hasAutoAnalyzed, handlePreview, currentPage])

  // History filtering
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

  const nextSubpage = () => {
    setCurrentSubpage((prev) => (prev + 1) % subpages.length)
  }

  const prevSubpage = () => {
    setCurrentSubpage((prev) => (prev - 1 + subpages.length) % subpages.length)
  }

  const currentSubpageData = subpages[currentSubpage]
  const CurrentComponent = currentSubpageData.component

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("siteecho-language", newLanguage)
  }

  // Page swap functionality
  const handlePageSwap = () => {
    setIsSwapping(true)
    setTimeout(() => {
      setCurrentPage(currentPage === 'analyzer' ? 'history' : 'analyzer')
      setIsSwapping(false)
    }, 150)
  }

  const clearHistory = () => {
    setHistory([])
    setFilteredHistory([])
    localStorage.removeItem("webanalyzer-history")
  }

  const deleteItem = (index: number) => {
    const newHistory = history.filter((_, i) => i !== index)
    setHistory(newHistory)
    setFilteredHistory(newHistory)
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
            <motion.div className="flex items-center gap-4" whileHover={{ scale: 1.02 }}>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 font-sans">URLinsights</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {currentPage === 'analyzer' ? t.tagline : `Analysis History - ${history.length} websites analyzed`}
                </p>
              </div>
            </motion.div>

            {/* Search + Analyze (only show on analyzer page) */}
            {currentPage === 'analyzer' && (
              <div className="flex-1 max-w-3xl mx-8">
                <div className="flex items-center gap-3">
                  <motion.div className="relative flex-1" whileFocus={{ scale: 1.02 }}>
                    <Input
                      type="url"
                      placeholder={t.urlPlaceholder}
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handlePreview()}
                      className="pl-12 pr-4 h-14 text-base border-slate-300 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl shadow-lg bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-slate-900 dark:text-slate-100"
                      disabled={isLoading}
                    />
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => handlePreview()}
                      disabled={isLoading || !url.trim()}
                      className="h-10 px-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          {t.analyzing}
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Get
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
            )}

            {/* History Search (only show on history page) */}
            {currentPage === 'history' && (
              <div className="flex-1 max-w-2xl mx-8">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search history..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 h-14 text-base border-slate-300 dark:border-slate-600 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-2xl shadow-lg bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-slate-900 dark:text-slate-100"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
              </div>
            )}

            {/* Right Actions: History + Clear + Settings */}
            <div className="flex items-center gap-3">
              {currentPage === 'history' && history.length > 0 && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={clearHistory}
                    className="h-14 px-6 border-slate-300 dark:border-slate-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl font-semibold bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm shadow-lg text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </motion.div>
              )}

              {currentPage === 'analyzer' && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={handlePageSwap}
                  className="h-10 px-4 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl font-medium bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm shadow-lg text-slate-900 dark:text-slate-100"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  {t.history} ({history.length})
                </Button>
              </motion.div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-12 px-3 rounded-2xl bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm border-0 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700"
                    aria-label="Settings"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-xs uppercase tracking-wider text-slate-500">Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuLabel>{t.language}</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={language} onValueChange={(val) => handleLanguageChange(val as Language)}>
                    <DropdownMenuRadioItem value="en">{t.english}</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="es">{t.spanish}</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="zh">{t.chinese}</DropdownMenuRadioItem>
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

      {/* Loading Bar */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-600 origin-left"
          />
        )}
      </AnimatePresence>

      {/* Page Content */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto p-6"
        >
          {currentPage === 'analyzer' ? (
            // Analyzer Content
            <div className="grid grid-cols-12 gap-8 min-h-[calc(100vh-200px)]">
              {/* Preview Pane */}
              <motion.div
                className="col-span-7"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <PreviewPane preview={currentPreview} isLoading={isLoading} language={language} />
              </motion.div>

              {/* Subpage Area */}
              <motion.div
                className="col-span-5"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {/* Subpage Title */}
                <motion.div
                  className="mb-6"
                  key={currentSubpage}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-br ${currentSubpageData.gradient} rounded-2xl flex items-center justify-center shadow-xl text-2xl`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {currentSubpageData.icon}
                    </motion.div>
                    <div>
                      <motion.h2
                        className="text-3xl font-black text-slate-900 dark:text-slate-100 font-sans"
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {currentSubpage === 0 && t.keywordInsights}
                        {currentSubpage === 1 && t.siteSearch}
                        {currentSubpage === 2 && t.similarSites}
                      </motion.h2>
                    </div>
                  </div>

                  {/* Animated Description */}
                  <motion.p
                    className="text-slate-600 text-lg leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    {(currentSubpage === 0
                      ? t.keywordDescription
                      : currentSubpage === 1
                        ? t.siteSearchDescription
                        : t.similarSitesDescription
                    )
                      .split(" ")
                      .map((word, index) => (
                        <motion.span
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          className="inline-block mr-1"
                        >
                          {word}
                        </motion.span>
                      ))}
                  </motion.p>
                </motion.div>

                {/* Subpage Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <motion.button
                    onClick={prevSubpage}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-full shadow-lg border border-slate-200/50 dark:border-slate-600/50 flex items-center justify-center hover:bg-white dark:hover:bg-slate-600 transition-all duration-200"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </motion.button>

                  <div className="flex gap-2">
                    {subpages.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentSubpage(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSubpage ? `bg-gradient-to-r ${currentSubpageData.gradient}` : "bg-slate-300"
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                      />
                    ))}
                  </div>

                  <motion.button
                    onClick={nextSubpage}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-full shadow-lg border border-slate-200/50 dark:border-slate-600/50 flex items-center justify-center hover:bg-white dark:hover:bg-slate-600 transition-all duration-200"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </motion.button>
                </div>

                {/* Subpage Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSubpage}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <CurrentComponent previewData={currentPreview} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          ) : (
            // History Content
            <div className="min-h-[calc(100vh-200px)]">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-16">
                  <Clock className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-200 mb-2">
                    {searchTerm ? "No matching results" : "No analysis history"}
                  </h3>
                  <p className="text-gray-500 dark:text-slate-400 mb-6">
                    {searchTerm ? "Try adjusting your search terms" : "Start analyzing websites to see your history here"}
                  </p>
                  <Button onClick={handlePageSwap} className="bg-emerald-600 hover:bg-emerald-700">
                    Start Analyzing
                  </Button>
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
                            e.currentTarget.src = "/placeholder.svg"
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
                              e.currentTarget.src = "/placeholder.svg"
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setUrl(item.url)
                              handlePageSwap()
                              setTimeout(() => handlePreview(item.url), 300)
                            }}
                            className="border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                          >
                            Re-analyze
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.main>
      </AnimatePresence>


    </div>
  )
}
