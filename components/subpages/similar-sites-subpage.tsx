"use client"

import { motion } from "framer-motion"
import { Globe, Search, ExternalLink } from "lucide-react"
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
        className="bg-white/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-200/50"
      >
        <Globe className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 mb-2">No Analysis Available</h3>
        <p className="text-slate-500">Analyze a website to find similar sites</p>
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
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Similar Websites</h3>
          <p className="text-sm text-slate-500">
            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium">
              API Integration Needed
            </span>
          </p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by URL or keywords..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12 bg-white/50 border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>
      </div>

      <div className="bg-white/50 rounded-xl border border-slate-200/50 overflow-hidden">
        <div className="grid grid-cols-2 gap-px bg-slate-200">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 font-semibold">Website URL</div>
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 font-semibold">Keywords</div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredSites.map((site, index) => (
            <motion.div
              key={site.url}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="grid grid-cols-2 gap-px bg-slate-200 hover:bg-slate-100 transition-colors"
            >
              <div className="bg-white p-4 flex items-center justify-between">
                <span className="font-medium text-slate-800">{site.url}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => window.open(`https://${site.url}`, "_blank")}
                  className="ml-2"
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
              <div className="bg-white p-4">
                <div className="flex flex-wrap gap-1">
                  {site.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        searchTerm && keyword.toLowerCase().includes(searchTerm.toLowerCase())
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {filteredSites.length === 0 && (
        <div className="text-center py-8">
          <p className="text-slate-500">No similar websites found matching your search</p>
        </div>
      )}
    </motion.div>
  )
}
