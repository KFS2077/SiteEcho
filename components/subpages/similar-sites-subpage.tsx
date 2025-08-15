"use client"

import { motion } from "framer-motion"
import { Globe, Search, ExternalLink, Network, Link2 } from "lucide-react"
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

// AI suggestions data
const suggestions = [
  {
    domain: "techcrunch.com",
    reason: "Similar tech content",
    description: "Technology news and startup coverage"
  },
  {
    domain: "wired.com", 
    reason: "Innovation focus",
    description: "Technology, science, and culture coverage"
  },
  {
    domain: "theverge.com",
    reason: "Tech journalism", 
    description: "Technology news and product reviews"
  }
]

// Categories data
const categories = [
  { name: "Technology", count: 245 },
  { name: "Business", count: 189 },
  { name: "Design", count: 127 },
  { name: "Education", count: 96 }
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Suggestions */}
        <div>
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">AI Suggestions</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">Beta</span>
              </div>
            </div>
            <div className="space-y-4">
              {suggestions.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors hover:shadow-sm group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <Link2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-blue-600 group-hover:text-blue-700 dark:text-blue-400 dark:group-hover:text-blue-300 cursor-pointer">{item.domain}</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{item.reason}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{item.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(`https://${item.domain}`, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Explore */}
        <div>
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">Explore by Category</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200">New</span>
              </div>
            </div>
            <div className="space-y-3">
              {categories.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors hover:shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700" />
                    <div>
                      <h5 className="font-medium text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">{item.name}</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.count} sites</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => alert(`Explore ${item.name}`)}>
                    Explore
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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

      <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
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
    </motion.div>
  )
}
