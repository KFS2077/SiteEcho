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

interface SearchEngineSubpageProps {
  previewData: PreviewData | null
}

export function SearchEngineSubpage({ previewData }: SearchEngineSubpageProps) {
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
        className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-200/50 dark:border-slate-700/50"
      >
        <Search className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">No Website Selected</h3>
        <p className="text-slate-500 dark:text-slate-400">Analyze a website to enable site search</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Search className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Search Within Site</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Searching within: {new URL(previewData.url).hostname}</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Search within this website..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSiteSearch()}
              className="h-12 w-full bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pl-4 pr-32 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Select value={searchEngine} onValueChange={setSearchEngine}>
                <SelectTrigger className="w-24 h-8 bg-transparent border-0 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg">
                  <span className="capitalize">{searchEngine}</span>
                </SelectTrigger>
                <SelectContent align="end">
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="bing">Bing</SelectItem>
                  <SelectItem value="duckduckgo">DuckDuckGo</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            className="bg-blue-50/50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/50"
          >
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
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
                  className="bg-white/70 dark:bg-slate-800/70 rounded-lg p-3 border border-slate-200/50 dark:border-slate-700/50"
                 >
                   <div className="flex items-start justify-between">
                     <div className="flex-1">
                      <h5 className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer">{result.title}</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{result.description}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{result.url}</p>
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
