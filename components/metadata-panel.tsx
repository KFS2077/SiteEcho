"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Clock, ExternalLink, Tag, Search, Globe, AlertCircle } from "lucide-react"
import { useState } from "react"

interface PreviewData {
  url: string
  title: string
  description: string
  favicon: string
  screenshot: string
  timestamp: Date
  keywords: string[] // Replaced safetyStatus with keywords
}

interface MetadataPanelProps {
  preview: PreviewData | null
}

export function MetadataPanel({ preview }: MetadataPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchEngine, setSearchEngine] = useState("google")

  if (!preview) {
    return (
      <Card className="h-full border-slate-200 bg-white shadow-sm p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-serif font-semibold text-slate-800 mb-2">Website Analysis</h3>
          <p className="text-sm text-slate-600">Website information will appear here after capturing a snapshot</p>
        </div>
      </Card>
    )
  }

  const handleSiteSearch = () => {
    if (!searchQuery.trim()) return

    const domain = new URL(preview.url).hostname
    let searchUrl = ""

    switch (searchEngine) {
      case "google":
        searchUrl = `https://www.google.com/search?q=site:${domain} ${encodeURIComponent(searchQuery)}`
        break
      case "bing":
        searchUrl = `https://www.bing.com/search?q=site:${domain} ${encodeURIComponent(searchQuery)}`
        break
      case "duckduckgo":
        searchUrl = `https://duckduckgo.com/?q=site:${domain} ${encodeURIComponent(searchQuery)}`
        break
    }

    window.open(searchUrl, "_blank")
  }

  const handleFindSimilar = () => {
    // API NEEDED: This would require a service like SimilarWeb API, Alexa API, or custom similarity analysis
    alert(
      "API Integration Required: This feature needs a website similarity service like SimilarWeb API or custom analysis engine.",
    )
  }

  return (
    <Card className="h-full border-slate-200 bg-white shadow-sm">
      <div className="p-6 space-y-6">
        {/* Site Info */}
        <div>
          <h3 className="font-serif font-semibold text-slate-800 mb-4">Site Information</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <img
                src={preview.favicon || "/placeholder.svg"}
                alt="Favicon"
                className="w-6 h-6 mt-0.5 flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
              <div className="min-w-0">
                <h4 className="font-medium text-slate-800 leading-tight mb-1">{preview.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{preview.description}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-1">URL</p>
              <p className="text-sm text-slate-700 break-all">{preview.url}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-serif font-semibold text-slate-800 mb-4">Keywords</h3>

          {preview.keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {preview.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200"
                >
                  <Tag className="w-3 h-3" />
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No keywords extracted</p>
          )}
        </div>

        <div>
          <h3 className="font-serif font-semibold text-slate-800 mb-4">Search Within Site</h3>

          <div className="space-y-3">
            <Select value={searchEngine} onValueChange={setSearchEngine}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select search engine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="bing">Bing</SelectItem>
                <SelectItem value="duckduckgo">DuckDuckGo</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                placeholder="Search within this website..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSiteSearch()}
                className="flex-1"
              />
              <Button onClick={handleSiteSearch} size="sm" className="px-3">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-serif font-semibold text-slate-800 mb-4">Similar Websites</h3>

          <Button
            variant="outline"
            className="w-full justify-center gap-2 border-slate-300 hover:bg-slate-50 bg-transparent"
            onClick={handleFindSimilar}
          >
            <Globe className="w-4 h-4" />
            Find Similar Sites
          </Button>

          <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                <strong>API Required:</strong> This feature needs integration with a website similarity service
                (SimilarWeb, Alexa, or custom analysis).
              </p>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div>
          <h3 className="font-serif font-semibold text-slate-800 mb-4">Snapshot Details</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-800">{preview.timestamp.toLocaleTimeString()}</p>
                <p className="text-xs text-slate-500">{preview.timestamp.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            className="w-full justify-center gap-2 border-slate-300 hover:bg-slate-50 bg-transparent"
            onClick={() => window.open(preview.url, "_blank")}
          >
            <ExternalLink className="w-4 h-4" />
            Visit Original Site
          </Button>
        </div>
      </div>
    </Card>
  )
}
