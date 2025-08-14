"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PreviewPane } from "@/components/preview-pane"
import { KeywordsSubpage } from "@/components/subpages/keywords-subpage"
import { SiteSearchSubpage } from "@/components/subpages/site-search-subpage"
import { SimilarSitesSubpage } from "@/components/subpages/similar-sites-subpage"
import { Globe, BarChart3, Clock, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { translations, type Language } from "@/lib/translations"
import { ThemeToggle } from "@/components/theme-toggle"

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
    component: SiteSearchSubpage,
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
    if (urlParam && !hasAutoAnalyzed) {
      setUrl(urlParam)
      setHasAutoAnalyzed(true)
      handlePreview(urlParam)
    }
  }, [searchParams, hasAutoAnalyzed, handlePreview])

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
                <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 font-sans">SiteEcho</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.tagline}</p>
              </div>
            </motion.div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
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
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Language Selection Buttons */}
              <div className="flex items-center gap-1 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-slate-200/50 dark:border-slate-600/50">
                {(["en", "es", "zh"] as Language[]).map((lang) => (
                  <motion.button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      language === lang ? "bg-emerald-500 text-white shadow-md" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                    }`}
                  >
                    {lang === "en" ? "EN" : lang === "es" ? "ES" : "中"}
                  </motion.button>
                ))}
              </div>

              <ThemeToggle />

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => handlePreview()}
                  disabled={isLoading || !url.trim()}
                  className="h-14 px-8 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      {t.analyzing}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      {t.analyze}
                    </>
                  )}
                </Button>
              </motion.div>

              <Link href="/history">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    className="h-14 px-6 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl font-semibold bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm shadow-lg text-slate-900 dark:text-slate-100"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {t.history} ({history.length})
                  </Button>
                </motion.div>
              </Link>
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

      <main className="max-w-7xl mx-auto p-6">
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
                <CurrentComponent previewData={currentPreview} language={language} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
