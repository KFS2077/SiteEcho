"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Search, Globe, Sparkles, Settings, Monitor, Sun, Moon, Zap, Brain, Code, Layers } from "lucide-react"
import Link from "next/link"
import { translations, type Language } from "@/lib/translations"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FancyPageTransition } from "@/components/page-transition"

const searchEngines = [
  { id: "google", name: "Google", icon: "🔍", color: "from-blue-500 to-blue-600" },
  { id: "bing", name: "Bing", icon: "🌐", color: "from-green-500 to-green-600" },
  { id: "duckduckgo", name: "DuckDuckGo", icon: "🦆", color: "from-orange-500 to-orange-600" },
  { id: "yandex", name: "Yandex", icon: "🔎", color: "from-red-500 to-red-600" },
  { id: "baidu", name: "Baidu", icon: "🐻", color: "from-blue-600 to-indigo-600" },
]

const syntaxOptions = [
  { id: "single", name: "Single Syntax", description: "Use one search engine's syntax", icon: Code },
  { id: "combined", name: "Combined Syntax", description: "Mix multiple search syntaxes", icon: Layers },
]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [selectedEngine, setSelectedEngine] = useState("google")
  const [syntaxMode, setSyntaxMode] = useState("single")
  const [aiRewrite, setAiRewrite] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [language, setLanguage] = useState<Language>("en")
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const savedLanguage = localStorage.getItem("siteecho-language") as Language
    if (savedLanguage && ["en", "es", "zh"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("siteecho-language", newLanguage)
  }

  const handleSearch = async () => {
    if (!query.trim()) return
    
    setIsSearching(true)
    
    // Simulate search process
    setTimeout(() => {
      const selectedEngineData = searchEngines.find(e => e.id === selectedEngine)
      let searchUrl = ""
      
      switch (selectedEngine) {
        case "google":
          searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`
          break
        case "bing":
          searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(query)}`
          break
        case "duckduckgo":
          searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`
          break
        case "yandex":
          searchUrl = `https://yandex.com/search/?text=${encodeURIComponent(query)}`
          break
        case "baidu":
          searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`
          break
      }
      
      window.open(searchUrl, '_blank')
      setIsSearching(false)
    }, 1000)
  }

  const t = translations[language]
  const selectedEngineData = searchEngines.find(e => e.id === selectedEngine)
  const selectedSyntaxData = syntaxOptions.find(s => s.id === syntaxMode)

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
            {/* Back Button + Logo */}
            <div className="flex items-center gap-4">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-full shadow-lg border border-slate-200/50 dark:border-slate-600/50 flex items-center justify-center hover:bg-white dark:hover:bg-slate-600 transition-all duration-200 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </Link>
              
              <motion.div className="flex items-center gap-4" whileHover={{ scale: 1.02 }}>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 font-sans">{t.searchPageTitle}</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t.searchPageTagline}</p>
                </div>
              </motion.div>
            </div>

            {/* Settings */}
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-12 px-3 bg-transparent border-0 text-slate-900 dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent"
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
        {isSearching && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            className="h-1 bg-gradient-to-r from-purple-500 to-purple-600 origin-left"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl mx-auto p-6"
      >
        <div className="space-y-8">
          {/* Search Input Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="space-y-6">
              {/* Main Search Input */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder={t.searchPlaceholderAdvanced}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="h-16 text-lg pl-16 pr-6 border-slate-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500/20 rounded-2xl shadow-lg bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-slate-900 dark:text-slate-100"
                  disabled={isSearching}
                />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 dark:text-slate-500" />
              </div>

              {/* Search Button */}
              <motion.div className="flex justify-center" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !query.trim()}
                  className="h-14 px-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-3" />
                      {t.searchNow}
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Configuration Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search Engine Selection */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.searchEngine}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {searchEngines.map((engine) => (
                      <motion.button
                        key={engine.id}
                        onClick={() => setSelectedEngine(engine.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          selectedEngine === engine.id
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white/50 dark:bg-slate-700/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{engine.icon}</span>
                          <span className="font-semibold text-slate-900 dark:text-slate-100">{engine.name}</span>
                          {selectedEngine === engine.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                            >
                              <div className="w-2 h-2 bg-white rounded-full" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Search Syntax & AI Options */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Syntax Mode */}
              <Card className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.searchSyntax}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {syntaxOptions.map((option) => {
                      const IconComponent = option.icon
                      return (
                        <motion.button
                          key={option.id}
                          onClick={() => setSyntaxMode(option.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left w-full ${
                            syntaxMode === option.id
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                              : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 bg-white/50 dark:bg-slate-700/50"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <IconComponent className="w-5 h-5 text-slate-600 dark:text-slate-400 mt-0.5" />
                            <div className="flex-1">
                              <div className="font-semibold text-slate-900 dark:text-slate-100">
                                {option.id === 'single' ? t.singleSyntax : t.combinedSyntax}
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {option.description}
                              </div>
                              {syntaxMode === option.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="mt-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
                                >
                                  <div className="text-xs font-mono text-slate-700 dark:text-slate-300">
                                    {option.id === 'single' ? (
                                      <div className="space-y-1">
                                        <div>• "exact phrase" - Search for exact phrase</div>
                                        <div>• site:example.com - Search within specific site</div>
                                        <div>• filetype:pdf - Search for specific file types</div>
                                      </div>
                                    ) : (
                                      <div className="space-y-1">
                                        <div>• "phrase" AND keyword - Combine multiple engines</div>
                                        <div>• (term1 OR term2) site:domain.com</div>
                                        <div>• Mix Google, Bing, DuckDuckGo syntax</div>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </div>
                            {syntaxMode === option.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"
                              >
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              </Card>

              {/* AI Rewrite */}
              <Card className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.aiRewrite}</h3>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-orange-500" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{t.enableAiRewrite}</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">Automatically optimize your search query</div>
                      </div>
                    </div>
                    <Switch
                      checked={aiRewrite}
                      onCheckedChange={setAiRewrite}
                      className="data-[state=checked]:bg-orange-500"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.main>
      </div>
    </FancyPageTransition>
  )
}