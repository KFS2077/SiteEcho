"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Search, ExternalLink, Globe } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"

interface PreviewData {
  url: string
  title: string
  description: string
  screenshot: string
  favicon: string
  keywords: string[]
  timestamp: string
}

interface SiteSearchSubpageProps {
  previewData: PreviewData | null
}

export function SiteSearchSubpage({ previewData }: SiteSearchSubpageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchEngine, setSearchEngine] = useState("google")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

  const handleSiteSearch = async () => {
    if (!searchQuery.trim() || !previewData) return

    setIsSearching(true)

    // Simulate search results
    setTimeout(() => {
      const mockResults = [
        {
          title: `${searchQuery} - ${previewData.title}`,
          url: `${previewData.url}/page1`,
          description: `Find information about ${searchQuery} on this website...`,
        },
        {
          title: `About ${searchQuery} | ${previewData.title}`,
          url: `${previewData.url}/about`,
          description: `Learn more about ${searchQuery} and related topics...`,
        },
      ]
      setSearchResults(mockResults)
      setIsSearching(false)

      // Open actual search in new tab
      const domain = new URL(previewData.url).hostname
      const searchUrl = `https://www.${searchEngine}.com/search?q=site:${domain} ${encodeURIComponent(searchQuery)}`
      window.open(searchUrl, "_blank")
    }, 1000)
  }

  if (!previewData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-200/50"
      >
        <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 mb-2">No Website Selected</h3>
        <p className="text-slate-500">Analyze a website to enable site search</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Search className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Search Within Site</h3>
          <p className="text-sm text-slate-500">Searching within: {new URL(previewData.url).hostname}</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex gap-3">
          <Select value={searchEngine} onValueChange={setSearchEngine}>
            <SelectTrigger className="w-16 h-12 bg-white/50 border-slate-200 rounded-xl flex items-center justify-center">
              <div className="text-lg">
                {searchEngine === "google" && "🔍"}
                {searchEngine === "bing" && "🔎"}
                {searchEngine === "duckduckgo" && "🦆"}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="google">🔍 Google</SelectItem>
              <SelectItem value="bing">🔎 Bing</SelectItem>
              <SelectItem value="duckduckgo">🦆 DuckDuckGo</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search within this website..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSiteSearch()}
              className="h-12 w-full bg-white/50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 px-4"
            />
          </div>
          <Button
            onClick={handleSiteSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="h-12 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl font-semibold"
          >
            {isSearching ? "Searching..." : "Go"}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50/50 rounded-xl p-4 border border-blue-200/50"
          >
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Search Results Preview
            </h4>
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/70 rounded-lg p-3 border border-slate-200/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-blue-600 hover:text-blue-700 cursor-pointer">{result.title}</h5>
                      <p className="text-sm text-slate-600 mt-1">{result.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{result.url}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(result.url, "_blank")}
                      className="ml-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
