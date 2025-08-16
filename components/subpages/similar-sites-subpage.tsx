"use client"

import { motion } from "framer-motion"
import { Globe, Search, ExternalLink, Network, Link2, Zap, Layers } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PreviewData {
  url: string
  title: string
  description: string
  screenshot: string
  favicon: string
  keywords: string[]
  timestamp: string
}

interface SimilarSitesSubpageProps {
  previewData: PreviewData | null
}

const mockSimilarSites = [
  { url: "example1.com", keywords: ["technology", "innovation", "software"] },
  { url: "example2.com", keywords: ["design", "creative", "portfolio"] },
  { url: "example3.com", keywords: ["business", "consulting", "strategy"] },
  { url: "example4.com", keywords: ["education", "learning", "courses"] },
  { url: "example5.com", keywords: ["health", "wellness", "fitness"] },
]



export function SimilarSitesSubpage({ previewData }: SimilarSitesSubpageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredSites, setFilteredSites] = useState(mockSimilarSites)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (!term.trim()) {
      setFilteredSites(mockSimilarSites)
    } else {
      const filtered = mockSimilarSites.filter(
        (site) =>
          site.url.toLowerCase().includes(term.toLowerCase()) ||
          site.keywords.some((keyword) => keyword.toLowerCase().includes(term.toLowerCase())),
      )
      setFilteredSites(filtered)
    }
  }

  if (!previewData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-200/50 dark:border-slate-700/50"
      >
        <Network className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">No Analysis Available</h3>
        <p className="text-slate-500 dark:text-slate-400">Analyze a website to find similar sites</p>
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
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
          <Network className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Similar Websites</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Searching within: {new URL(previewData.url).hostname}</p>
        </div>
      </div>

      {/* Search Bar - Moved to top */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <Input
            type="text"
            placeholder="Search by URL or keywords..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12 bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400"
          />
        </div>
      </div>



      {/* Results Table */}
      <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden mb-6">
        <div className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-700">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 font-semibold">Website URL</div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 font-semibold">Keywords</div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredSites.length === 0 ? (
            <div className="p-4 text-sm text-slate-500 dark:text-slate-400">No similar websites found matching your search</div>
          ) : (
            filteredSites.map((site, index) => (
              <motion.div
                key={site.url}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                <div className="bg-white dark:bg-slate-800 p-4 flex items-center justify-between">
                  <span className="font-medium text-slate-800 dark:text-slate-100">{site.url}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(`https://${site.url}`, "_blank")}
                    className="ml-2 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4">
                  <div className="flex flex-wrap gap-1">
                    {site.keywords.map((keyword: string) => (
                      <span
                        key={keyword}
                        className="px-2 py-1 text-xs rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* AI Suggestions - moved below results */}
      <div className="mb-6">
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">AI Suggestions</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">API Call</span>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">Beta</span>
              <Button size="sm" variant="outline" disabled className="text-xs px-3 py-1">
                Closed
              </Button>
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400 text-sm">AI suggestions are currently unavailable</p>
          </div>
        </div>
      </div>

      {/* Explore by Category - moved to bottom */}
      <div>
        <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-500" />
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">Explore by Category</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">API Call</span>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">New</span>
              <Button size="sm" variant="outline" disabled className="text-xs px-3 py-1">
                Closed
              </Button>
            </div>
          </div>
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400 text-sm">Category exploration is currently unavailable</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
