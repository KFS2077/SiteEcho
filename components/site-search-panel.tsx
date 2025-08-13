"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, ExternalLink, AlertCircle, X } from "lucide-react"
import { useState } from "react"

interface SiteSearchPanelProps {
  url: string | null
}

interface SearchResult {
  title: string
  url: string
  snippet: string
}

export function SiteSearchPanel({ url }: SiteSearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchEngine, setSearchEngine] = useState("google")
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])

  if (!url) {
    return (
      <Card className="border-gray-200 bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="gradient-blue p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif font-black text-white text-lg">Within-site search</h3>
              <p className="text-blue-100 text-sm font-medium">Analyze search behaviors on your site</p>
            </div>
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-blue-500" />
          </div>
          <p className="text-gray-600 font-medium">Search within a website after capturing a snapshot</p>
        </div>
      </Card>
    )
  }

  const domain = new URL(url).hostname

  const handleSiteSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setShowResults(true)

    setTimeout(() => {
      const mockResults: SearchResult[] = [
        {
          title: `${searchQuery} - Results from ${domain}`,
          url: `${url}/search?q=${searchQuery}`,
          snippet: `Search results for "${searchQuery}" within ${domain}. This is a simulated result.`,
        },
        {
          title: `About ${searchQuery} on ${domain}`,
          url: `${url}/about/${searchQuery}`,
          snippet: `Learn more about ${searchQuery} and related topics on this website.`,
        },
        {
          title: `${searchQuery} Documentation`,
          url: `${url}/docs/${searchQuery}`,
          snippet: `Technical documentation and guides related to ${searchQuery}.`,
        },
      ]
      setResults(mockResults)
      setIsSearching(false)
    }, 1500)

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

  return (
    <Card className="border-gray-200 bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="gradient-blue p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600/30 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-serif font-black text-white text-lg">Within-site search</h3>
            <p className="text-blue-100 text-sm font-medium">Understand user intent and optimize accordingly</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800 font-semibold">Searching within: {domain}</p>
              <p className="text-xs text-blue-600 mt-1 font-medium">
                Using {searchEngine} to find content specifically on this website
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Select value={searchEngine} onValueChange={setSearchEngine}>
            <SelectTrigger className="w-full h-12 rounded-xl border-gray-300 font-medium">
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
              className="flex-1 h-12 rounded-xl border-gray-300 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              onClick={handleSiteSearch}
              size="sm"
              className="h-12 px-6 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isSearching}
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 border-2 border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <h4 className="font-serif font-bold text-gray-800">Search Results</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResults(false)}
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-4 max-h-64 overflow-y-auto custom-scrollbar">
              {isSearching ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((result, index) => (
                    <div key={index} className="group">
                      <button
                        onClick={() => window.open(result.url, "_blank")}
                        className="text-left w-full p-3 rounded-lg hover:bg-white transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-blue-600 text-sm group-hover:underline truncate">
                              {result.title}
                            </h5>
                            <p className="text-xs text-gray-600 mt-2 line-clamp-2 font-medium">{result.snippet}</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
