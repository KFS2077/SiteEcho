"use client"

import { motion } from "framer-motion"
import { Search, Copy, Check, Minus, Info } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { translations, type Language } from "@/lib/translations"

interface PreviewData {
  url: string
  title: string
  description: string
  screenshot: string
  favicon: string
  keywords: string[]
  timestamp: string
}

interface SearchEngineSubpageProps {
  previewData: PreviewData | null
  language: Language
}

interface SearchOperator {
  name: string
  description: string
  example: string
  syntax: string
  google: boolean
  bing: boolean
  duckduckgo: boolean
}

const searchOperators: SearchOperator[] = [
  {
    name: "Site Search",
    description: "Search within a specific website",
    example: "site:github.com machine learning",
    syntax: "site:",
    google: true,
    bing: true,
    duckduckgo: true
  },
  {
    name: "Exact Phrase",
    description: "Search for exact phrase in quotes",
    example: '"artificial intelligence"',
    syntax: '""',
    google: true,
    bing: true,
    duckduckgo: true
  },
  {
    name: "Title Search",
    description: "Search for words in page title",
    example: "intitle:react tutorial",
    syntax: "intitle:",
    google: true,
    bing: true,
    duckduckgo: false
  },
  {
    name: "URL Search",
    description: "Search for words in URL",
    example: "inurl:blog javascript",
    syntax: "inurl:",
    google: true,
    bing: false,
    duckduckgo: false
  },
  {
    name: "File Type",
    description: "Search for specific file types",
    example: "machine learning filetype:pdf",
    syntax: "filetype:",
    google: true,
    bing: true,
    duckduckgo: false
  },
  {
    name: "Exclude Term",
    description: "Exclude pages containing specific words",
    example: "python tutorial -beginner",
    syntax: "-",
    google: true,
    bing: true,
    duckduckgo: true
  },
  {
    name: "Include Term",
    description: "Include pages that must contain specific words",
    example: "+javascript +typescript",
    syntax: "+",
    google: true,
    bing: true,
    duckduckgo: false
  },
  {
    name: "OR Search",
    description: "Search for either term",
    example: "python OR javascript",
    syntax: "OR",
    google: true,
    bing: true,
    duckduckgo: true
  },
  {
    name: "Wildcard",
    description: "Use * as wildcard for unknown words",
    example: '"web * framework"',
    syntax: "*",
    google: true,
    bing: true,
    duckduckgo: false
  },
  {
    name: "Date Range",
    description: "Search within date range",
    example: "covid after:2020 before:2022",
    syntax: "after:/before:",
    google: true,
    bing: false,
    duckduckgo: false
  }
]

const searchEngines = [
  { id: "google", name: "Google", url: "https://www.google.com/search?q=", icon: "🔍" },
  { id: "bing", name: "Bing", url: "https://www.bing.com/search?q=", icon: "🔎" },
  { id: "duckduckgo", name: "DuckDuckGo", url: "https://duckduckgo.com/?q=", icon: "🦆" }
]

export function SearchEngineSubpage({ previewData, language }: SearchEngineSubpageProps) {
  const [selectedEngine, setSelectedEngine] = useState("google")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeOperators, setActiveOperators] = useState<string[]>([])
  const [copied, setCopied] = useState(false)
  const t = translations[language]

  const selectedEngineData = searchEngines.find(engine => engine.id === selectedEngine)
  const availableOperators = searchOperators.filter(op => op[selectedEngine as keyof SearchOperator] === true)

  const toggleOperator = (operatorName: string) => {
    setActiveOperators(prev => 
      prev.includes(operatorName) 
        ? prev.filter(name => name !== operatorName)
        : [...prev, operatorName]
    )
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    
    const encodedQuery = encodeURIComponent(searchQuery)
    const searchUrl = `${selectedEngineData?.url}${encodedQuery}`
    window.open(searchUrl, '_blank')
  }

  const copyQuery = async () => {
    try {
      await navigator.clipboard.writeText(searchQuery)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy query:', err)
    }
  }

  const insertOperator = (operator: SearchOperator) => {
    const cursorPosition = (document.querySelector('#search-query') as HTMLTextAreaElement)?.selectionStart || searchQuery.length
    const beforeCursor = searchQuery.slice(0, cursorPosition)
    const afterCursor = searchQuery.slice(cursorPosition)
    
    let insertion = ""
    switch (operator.syntax) {
      case '""':
        insertion = `"${beforeCursor ? ' ' : ''}${afterCursor ? ' ' : ''}"`
        break
      case 'site:':
        insertion = `${beforeCursor ? ' ' : ''}site:example.com${afterCursor ? ' ' : ''}`
        break
      case 'intitle:':
        insertion = `${beforeCursor ? ' ' : ''}intitle:${afterCursor ? ' ' : ''}`
        break
      case 'inurl:':
        insertion = `${beforeCursor ? ' ' : ''}inurl:${afterCursor ? ' ' : ''}`
        break
      case 'filetype:':
        insertion = `${beforeCursor ? ' ' : ''}filetype:pdf${afterCursor ? ' ' : ''}`
        break
      case '-':
        insertion = `${beforeCursor ? ' ' : ''}-${afterCursor ? ' ' : ''}`
        break
      case '+':
        insertion = `${beforeCursor ? ' ' : ''}+${afterCursor ? ' ' : ''}`
        break
      case 'OR':
        insertion = `${beforeCursor ? ' ' : ''}OR${afterCursor ? ' ' : ''}`
        break
      case '*':
        insertion = `${beforeCursor ? ' ' : ''}*${afterCursor ? ' ' : ''}`
        break
      case 'after:/before:':
        insertion = `${beforeCursor ? ' ' : ''}after:2020${afterCursor ? ' ' : ''}`
        break
      default:
        insertion = `${beforeCursor ? ' ' : ''}${operator.syntax}${afterCursor ? ' ' : ''}`
    }
    
    setSearchQuery(beforeCursor + insertion + afterCursor)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
          <Search className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t.advancedSearchEngine || "Advanced Search Engine"}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.advancedSearchDescription || "Build advanced search queries with operators"}</p>
        </div>
      </div>

      {/* Search Engine Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {t.selectSearchEngine || "Select Search Engine"}
        </label>
        <Select value={selectedEngine} onValueChange={setSelectedEngine}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {searchEngines.map((engine) => (
              <SelectItem key={engine.id} value={engine.id}>
                <div className="flex items-center gap-2">
                  <span>{engine.icon}</span>
                  <span>{engine.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Query Builder */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {t.searchQuery || "Search Query"}
        </label>
        <div className="relative">
          <Textarea
            id="search-query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.enterSearchQuery || "Enter your search query with operators..."}
            className="min-h-[100px] pr-12"
          />
          <Button
            onClick={copyQuery}
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 p-0"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Available Operators */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {t.availableOperators || "Available Operators"}
          </h4>
          <Badge variant="outline" className="text-xs">
            {selectedEngineData?.name}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableOperators.map((operator) => (
            <Card key={operator.name} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => insertOperator(operator)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-medium text-sm text-slate-800 dark:text-slate-100">{operator.name}</h5>
                  <Badge variant="outline" className="text-xs font-mono">{operator.syntax}</Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{operator.description}</p>
                <code className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-700 dark:text-slate-300">
                  {operator.example}
                </code>
                {/* Engine Support Indicators */}
                <div className="flex items-center gap-1 mt-2">
                  {operator.google && <Badge variant={selectedEngine === 'google' ? 'default' : 'secondary'} className="text-xs">G</Badge>}
                  {operator.bing && <Badge variant={selectedEngine === 'bing' ? 'default' : 'secondary'} className="text-xs">B</Badge>}
                  {operator.duckduckgo && <Badge variant={selectedEngine === 'duckduckgo' ? 'default' : 'secondary'} className="text-xs">D</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Search Actions */}
      <div className="flex items-center gap-3">
        <Button 
          onClick={handleSearch}
          disabled={!searchQuery.trim()}
          className="flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          {t.searchNow || "Search Now"}
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => setSearchQuery("")}
          className="flex items-center gap-2"
        >
          <Minus className="w-4 h-4" />
          {t.clear || "Clear"}
        </Button>
      </div>

      {/* Help Info */}
      <div className="mt-6 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p className="mb-1">
              <strong>{t.tips || "Tips"}:</strong>
            </p>
            <ul className="text-xs space-y-1 text-blue-600 dark:text-blue-400">
              <li>• {t.clickOperatorTip || "Click on any operator card to insert it into your query"}</li>
              <li>• {t.combineOperatorsTip || "Combine multiple operators for more precise results"}</li>
              <li>• {t.engineLimitationsTip || "Not all operators work on all search engines"}</li>
              <li>• {t.quotesForPhrasesTip || "Use quotes for exact phrase matching"}</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}