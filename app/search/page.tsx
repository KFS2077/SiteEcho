"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Search, Settings, Monitor, Sun, Moon, Code, Brain, MousePointer } from "lucide-react"
import Link from "next/link"
import { translations, type Language } from "@/lib/translations"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FancyPageTransition } from "@/components/page-transition"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

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

// Dynamic Network Background Component
const NetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // Particles configuration
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      alpha: number
    }> = []
    
    const particleCount = 80
    const maxDistance = 120
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3
      })
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update particles
      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1
        
        // Keep particles within bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))
      })
      
      // Draw connections
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.15)'
      ctx.lineWidth = 1
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3
            ctx.strokeStyle = `rgba(100, 116, 139, ${opacity})`
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      
      // Draw particles
      particles.forEach(particle => {
        ctx.fillStyle = `rgba(100, 116, 139, ${particle.alpha})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })
      
      requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)' }}
    />
  )
}

// Enhanced categorized syntaxes with engine-specific information
interface SyntaxItem {
  id: string
  label: string
  insert: string
  description: string
  engines: EngineId[]
  combinable: boolean
}

interface SyntaxCategory {
  id: string
  name: string
  items: SyntaxItem[]
}

const syntaxCategories: SyntaxCategory[] = [
  {
    id: "basic",
    name: "Basic Operators",
    items: [
      { id: "exact", label: '"exact phrase"', insert: '"exact phrase"', description: "Search for the exact phrase as typed.", engines: ["google", "bing", "duckduckgo", "yandex"], combinable: true },
      { id: "and", label: "AND", insert: " AND ", description: "Require both terms to appear in results (default behavior).", engines: ["google", "bing", "duckduckgo", "yandex"], combinable: true },
      { id: "or", label: "OR", insert: " OR ", description: "Find results that contain either of the terms.", engines: ["google", "bing", "duckduckgo", "yandex"], combinable: true },
      { id: "exclude", label: "-exclude", insert: " -", description: "Exclude results containing the following word.", engines: ["google", "bing", "duckduckgo", "yandex"], combinable: true },
      { id: "plus", label: "+include", insert: " +", description: "Force inclusion of common words (Bing specific).", engines: ["bing"], combinable: true },
    ],
  },
  {
    id: "location",
    name: "Page Location",
    items: [
      { id: "site", label: "site:", insert: "site:", description: "Restrict results to a specific website or domain.", engines: ["google", "bing", "duckduckgo", "yandex"], combinable: true },
      { id: "intitle", label: "intitle:", insert: "intitle:", description: "Find pages with specific words in the title.", engines: ["google", "bing", "duckduckgo"], combinable: true },
      { id: "allintitle", label: "allintitle:", insert: "allintitle:", description: "Find pages with ALL words in the title (Google only).", engines: ["google"], combinable: false },
      { id: "inurl", label: "inurl:", insert: "inurl:", description: "Find pages with specific words in the URL.", engines: ["google", "bing", "duckduckgo"], combinable: true },
      { id: "allinurl", label: "allinurl:", insert: "allinurl:", description: "Find pages with ALL words in the URL (Google only).", engines: ["google"], combinable: false },
      { id: "inbody", label: "inbody:", insert: "inbody:", description: "Find pages with words in the body text (Bing/DuckDuckGo).", engines: ["bing", "duckduckgo"], combinable: true },
      { id: "inanchor", label: "inanchor:", insert: "inanchor:", description: "Find pages with words in anchor text of links.", engines: ["google", "bing"], combinable: true },
    ],
  },
  {
    id: "content",
    name: "Content & File Types", 
    items: [
      { id: "filetype", label: "filetype:", insert: "filetype:", description: "Filter results by file type (pdf, doc, ppt, etc.).", engines: ["google", "bing", "duckduckgo"], combinable: true },
      { id: "ext", label: "ext:", insert: "ext:", description: "Alternative to filetype: (Bing specific).", engines: ["bing"], combinable: true },
      { id: "contains", label: "contains:", insert: "contains:", description: "Find pages linking to specific file types (Bing only).", engines: ["bing"], combinable: true },
      { id: "cache", label: "cache:", insert: "cache:", description: "Show Google's cached version of a page.", engines: ["google"], combinable: false },
      { id: "link", label: "link:", insert: "link:", description: "Find pages that link to a specific URL.", engines: ["google"], combinable: false },
      { id: "related", label: "related:", insert: "related:", description: "Find pages similar to a specific URL.", engines: ["google"], combinable: false },
    ],
  },
  {
    id: "proximity",
    name: "Proximity & Grouping",
    items: [
      { id: "near", label: "NEAR", insert: " NEAR ", description: "Find terms appearing close to each other.", engines: ["bing", "yandex"], combinable: true },
      { id: "around", label: "AROUND(X)", insert: " AROUND(5) ", description: "Words within X words of each other (Google only).", engines: ["google"], combinable: true },
      { id: "group", label: "( )", insert: "(", description: "Group multiple terms and operators.", engines: ["google", "bing", "duckduckgo", "yandex"], combinable: true },
      { id: "wildcard", label: "* wildcard", insert: '"* "', description: "Match any word or phrase between terms.", engines: ["google", "bing"], combinable: true },
    ],
  },
  {
    id: "advanced",
    name: "Advanced (Engine Specific)",
    items: [
      { id: "define", label: "define:", insert: "define:", description: "Get definition of a term.", engines: ["google", "bing"], combinable: false },
      { id: "ip", label: "ip:", insert: "ip:", description: "Find pages hosted at specific IP (Bing only).", engines: ["bing"], combinable: true },
      { id: "language", label: "language:", insert: "language:", description: "Filter by language (Bing only).", engines: ["bing"], combinable: true },
      { id: "loc", label: "loc:", insert: "loc:", description: "Filter by location/country (Bing only).", engines: ["bing"], combinable: true },
      { id: "host", label: "host:", insert: "host:", description: "Search specific host (Yandex only).", engines: ["yandex"], combinable: true },
      { id: "rhost", label: "rhost:", insert: "rhost:", description: "Reverse host search (Yandex only).", engines: ["yandex"], combinable: true },
      { id: "mime", label: "mime:", insert: "mime:", description: "Search by MIME type (Yandex only).", engines: ["yandex"], combinable: true },
      { id: "feed", label: "feed:", insert: "feed:", description: "Find RSS/Atom feeds (Bing only).", engines: ["bing"], combinable: true },
      { id: "hasfeed", label: "hasfeed:", insert: "hasfeed:", description: "Find sites with RSS feeds (Bing only).", engines: ["bing"], combinable: true },
    ],
  },
]

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [selectedEngine, setSelectedEngine] = useState<EngineId>("google")
  const [aiEnhance, setAiEnhance] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [language, setLanguage] = useState<Language>("en")
  const [activeSyntax, setActiveSyntax] = useState<SyntaxItem | null>(null)
  const [showSyntaxPanel, setShowSyntaxPanel] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const savedLanguage = localStorage.getItem("siteecho-language") as Language
    if (savedLanguage && ["en", "es"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("siteecho-language", newLanguage)
  }

  const triggerInsert = (item: SyntaxItem) => {
    setActiveSyntax(item)
    
    // Check if the item is combinable - if so, append to existing query
    if (item.combinable && query.trim()) {
      // For combinable items, append to existing content
      const currentQuery = query.trim()
      const newContent = item.insert
      
      // Add space before appending if it doesn't already exist
      const needsSpace = !currentQuery.endsWith(' ') && !newContent.startsWith(' ')
      setQuery(currentQuery + (needsSpace ? ' ' : '') + newContent)
    } else {
      // For non-combinable items, overwrite the existing content
      setQuery(item.insert)
    }
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

  // Filter syntax categories based on selected engine
  const filteredSyntaxCategories = syntaxCategories.map(category => ({
    ...category,
    items: category.items.filter(item => item.engines.includes(selectedEngine))
  })).filter(category => category.items.length > 0)

  return (
    <FancyPageTransition>
      <div className="relative min-h-screen overflow-hidden">
        <NetworkBackground />
        {/* Header Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border-b border-transparent shadow-lg" 
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
                    <p className="text-sm text-slate-500 dark:text-white font-medium">{t.searchPageTagline}</p>
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

        {/* Main Content - Centered Search */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
          {/* Centered Search Input Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-4xl"
          >
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-3xl">
                {/* Search Syntax Icon with Animated Ring */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <motion.button
                    onClick={() => setShowSyntaxPanel(!showSyntaxPanel)}
                    className="relative w-8 h-8 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Animated Ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      animate={{
                        rotate: 360,
                        scale: showSyntaxPanel ? [1, 1.2, 1] : [1, 1.1, 1]
                      }}
                      transition={{
                        rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                      }}
                    />
                    <div className="relative w-6 h-6 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                      <Code className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    
                    {/* Mouse Click Animation */}
                    <motion.div
                      className="absolute -top-2 -right-2 pointer-events-none"
                      animate={{
                        scale: [0, 1, 1, 0],
                        opacity: [0, 1, 1, 0],
                        x: [0, 2, 2, 0],
                        y: [0, -2, -2, 0]
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.3, 0.7, 1]
                      }}
                    >
                      <div className="relative">
                        <MousePointer className="w-4 h-4 text-purple-600 dark:text-purple-400 drop-shadow-lg" />
                        {/* Click ripple effect */}
                        <motion.div
                          className="absolute inset-0 rounded-full border-2 border-purple-400"
                          animate={{
                            scale: [1, 2.5],
                            opacity: [0.8, 0]
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            repeatDelay: 1.9,
                            ease: "easeOut"
                          }}
                        />
                      </div>
                    </motion.div>
                  </motion.button>
                </div>

                {/* The input itself */}
                <Input
                  type="text"
                  placeholder={t.searchPlaceholderAdvanced}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="h-16 text-lg pl-16 pr-44 border-slate-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500/20 rounded-2xl shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur text-slate-900 dark:text-slate-100"
                  disabled={isSearching}
                />

                {/* Right inline engine select */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Select value={selectedEngine} onValueChange={(val) => setSelectedEngine(val as EngineId)}>
                    <SelectTrigger className={`w-40 h-10 rounded-xl bg-white/90 dark:bg-slate-700/90 border-slate-300 dark:border-slate-600 ${engineFontClass[selectedEngine]}`} aria-label="Select search engine">
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
        </div>

        {/* Responsive Search Syntax Panel */}
        <AnimatePresence>
          {showSyntaxPanel && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                onClick={() => setShowSyntaxPanel(false)}
              />
              
              {/* Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[80vh] overflow-y-auto z-50 mx-4"
              >
                <Card className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                          <Code className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.searchSyntax}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">For {searchEngines.find(e => e.id === selectedEngine)?.name}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSyntaxPanel(false)}
                        className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                      >
                        ✕
                      </Button>
                    </div>

                    {/* Category rows - filtered by engine */}
                    <div className="space-y-3">
                      {filteredSyntaxCategories.map((cat) => (
                        <div key={cat.id} className="space-y-2">
                          <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">{cat.name}</div>
                          <div className="overflow-x-auto">
                            <div className="flex gap-2 flex-wrap">
                              {cat.items.map((item) => (
                                <button
                                   key={item.id}
                                   onMouseEnter={() => setActiveSyntax(item)}
                                   onFocus={() => setActiveSyntax(item)}
                                  onMouseLeave={() => {}}
                                   onClick={() => {
                                     triggerInsert(item)
                                     setShowSyntaxPanel(false)
                                   }}
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
                          <div className="text-slate-500 dark:text-slate-400">Hover or select a syntax to see details and auto-insert.</div>
                        )}
                      </motion.div>
                    </div>

                    {/* AI Enhance toggle inside Search Syntax section */}
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">AI Enhance</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Improve and enrich your query with AI-driven suggestions before sending to the engine.</div>
                          </div>
                        </div>
                        <Switch checked={aiEnhance} onCheckedChange={setAiEnhance} className="data-[state=checked]:bg-purple-600" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </FancyPageTransition>
  )
}