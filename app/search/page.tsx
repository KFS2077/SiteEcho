"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
// Removed Badge import as it's no longer used
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Search, Settings, Monitor, Sun, Moon, Zap, Brain } from "lucide-react"
import Link from "next/link"
import { translations, type Language } from "@/lib/translations"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FancyPageTransition } from "@/components/page-transition"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Streamlined engines: removed Baidu
const searchEngines = [
  { id: "google", name: "Google" },
  { id: "bing", name: "Bing" },
  { id: "duckduckgo", name: "DuckDuckGo" },
  { id: "yandex", name: "Yandex" },
] as const

type EngineId = typeof searchEngines[number]["id"]

const engineFontClass: Record<EngineId, string> = {
  google: "font-sans font-semibold",
  bing: "font-serif",
  duckduckgo: "font-mono",
  yandex: "italic tracking-wide",
}

// Enhanced categorized syntaxes
interface SyntaxItem {
  id: string
  label: string // The visible label on the pill
  insert: string // What to insert into the input (using the word `example`)
  description: string
}
interface SyntaxCategory {
  id: string
  name: string
  items: SyntaxItem[]
}

const syntaxCategories: SyntaxCategory[] = [
  {
    id: "phrases",
    name: "Phrases & Operators",
    items: [
      { id: "exact", label: '"exact phrase"', insert: '"example example"', description: "Search for the exact phrase as typed." },
      { id: "and", label: "AND", insert: "example AND example", description: "Require both terms to appear in results." },
      { id: "or", label: "OR", insert: "example OR example", description: "Find results that contain either of the terms." },
      { id: "exclude", label: "-exclude", insert: "example -example", description: "Exclude results containing a specific word." },
    ],
  },
  {
    id: "scope",
    name: "Scope & Filters",
    items: [
      { id: "site", label: "site:", insert: "site:example.com example", description: "Restrict results to a specific website or domain." },
      { id: "filetype", label: "filetype:", insert: "filetype:pdf example", description: "Filter results by file type such as pdf, doc, ppt, etc." },
      { id: "intitle", label: "intitle:", insert: "intitle:example", description: "Find pages with a word in the title." },
      { id: "inurl", label: "inurl:", insert: "inurl:example", description: "Find pages with a word in the URL." },
    ],
  },
  {
    id: "grouping",
    name: "Grouping & Advanced",
    items: [
      { id: "group", label: "( )", insert: "(example OR example) AND example", description: "Group multiple terms and operators to fine-tune logic." },
      { id: "wildcard", label: "* wildcard", insert: '"example * example"', description: "Match any word or short phrase between two terms." },
      { id: "proximity", label: "NEAR", insert: "example NEAR example", description: "Find terms appearing close to each other (engine dependent)." },
    ],
  },
]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [selectedEngine, setSelectedEngine] = useState<EngineId>("google")
  const [aiRewrite, setAiRewrite] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [language, setLanguage] = useState<Language>("en")
  const [activeSyntax, setActiveSyntax] = useState<SyntaxItem | null>(null)
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

  const triggerInsert = (item: SyntaxItem) => {
    setActiveSyntax(item)
    setQuery(item.insert)
  }

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)

    setTimeout(() => {
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
      }

      window.open(searchUrl, '_blank')
      setIsSearching(false)
    }, 800)
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
                {/* Integrated Search Input with icon + inline engine dropdown */}
                <div className="relative">
                  {/* Left clickable icon */}
                  <button
                    onClick={handleSearch}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-purple-500 hover:bg-purple-600 transition-colors flex items-center justify-center text-white shadow"
                    aria-label="Search"
                    disabled={isSearching}
                  >
                    <Search className="w-5 h-5" />
                  </button>

                  {/* The input itself */}
                  <Input
                    type="text"
                    placeholder={t.searchPlaceholderAdvanced}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="h-16 text-lg pl-14 pr-48 border-slate-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500/20 rounded-2xl shadow-lg bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-slate-900 dark:text-slate-100"
                    disabled={isSearching}
                  />

                  {/* Right inline engine select */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Select value={selectedEngine} onValueChange={(val) => setSelectedEngine(val as EngineId)}>
                      <SelectTrigger className={`w-40 h-10 rounded-xl bg-white/70 dark:bg-slate-700/70 border-slate-300 dark:border-slate-600 ${engineFontClass[selectedEngine]}`} aria-label="Select search engine">
                        <SelectValue placeholder="Engine" />
                      </SelectTrigger>
                      <SelectContent align="end" className="min-w-[10rem]">
                        <SelectItem value="google" className="font-sans font-semibold">Google</SelectItem>
                        <SelectItem value="bing" className="font-serif">Bing</SelectItem>
                        <SelectItem value="duckduckgo" className="font-mono">DuckDuckGo</SelectItem>
                        <SelectItem value="yandex" className="italic tracking-wide">Yandex</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Syntax selector and AI options */}
            <div className="space-y-6">
              {/* Syntax Categories */}
              <Card className="p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.searchSyntax}</h3>
                  </div>

                  {/* Category rows */}
                  <div className="space-y-3">
                    {syntaxCategories.map((cat) => (
                      <div key={cat.id} className="space-y-2">
                        <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">{cat.name}</div>
                        <div className="overflow-x-auto">
                          <div className="flex gap-2 whitespace-nowrap">
                            {cat.items.map((item) => (
                              <button
                                 key={item.id}
                                 onMouseEnter={() => setActiveSyntax(item)}
                                 onFocus={() => setActiveSyntax(item)}
                                onMouseLeave={() => {}}
                                 onClick={() => triggerInsert(item)}
                                 className={`px-3 py-2 rounded-xl border text-sm transition-all bg-white/60 dark:bg-slate-700/60 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-slate-200 dark:border-slate-600 hover:border-purple-400`}
                                 title={item.description}
                               >
                                 {item.label}
                               </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Contextual description */}
                  <div className="mt-2">
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: activeSyntax ? 1 : 0.6, y: activeSyntax ? 0 : 0 }}
                      className="text-sm text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-3"
                    >
                      {activeSyntax ? (
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-100 mb-1">{activeSyntax.label}</div>
                          <div className="text-slate-600 dark:text-slate-300">{activeSyntax.description}</div>
                          <div className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400">Example inserted: {activeSyntax.insert}</div>
                        </div>
                      ) : (
                        <div className="text-slate-500 dark:text-slate-400">Hover or select a syntax to see details and auto-insert an example using the keyword "example".</div>
                      )}
                    </motion.div>
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
            </div>
          </div>
        </motion.main>
      </div>
    </FancyPageTransition>
  )
}