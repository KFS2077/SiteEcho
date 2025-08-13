"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, Search, ExternalLink, AlertCircle, Tag } from "lucide-react"
import { useState } from "react"

interface SimilarSite {
  url: string
  keywords: string[]
  title?: string
}

interface SimilarSitesPanelProps {
  currentUrl: string | null
}

export function SimilarSitesPanel({ currentUrl }: SimilarSitesPanelProps) {
  const [searchKeyword, setSearchKeyword] = useState("")
  const [similarSites, setSimilarSites] = useState<SimilarSite[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const mockSimilarSites: SimilarSite[] = [
    {
      url: "https://example1.com",
      keywords: ["web design", "development", "portfolio", "creative"],
      title: "Creative Web Studio",
    },
    {
      url: "https://example2.com",
      keywords: ["design", "ui", "ux", "modern", "portfolio"],
      title: "Modern Design Agency",
    },
    {
      url: "https://example3.com",
      keywords: ["development", "react", "javascript", "frontend"],
      title: "Frontend Development Blog",
    },
    {
      url: "https://example4.com",
      keywords: ["creative", "portfolio", "photography", "art"],
      title: "Creative Portfolio Site",
    },
    {
      url: "https://example5.com",
      keywords: ["web design", "ui", "modern", "clean"],
      title: "Clean Design Studio",
    },
  ]

  const handleFindSimilar = async () => {
    if (!currentUrl) return

    setIsLoading(true)
    setHasSearched(true)

    setTimeout(() => {
      setSimilarSites(mockSimilarSites)
      setIsLoading(false)
    }, 2000)
  }

  const filteredSites = similarSites.filter(
    (site) =>
      searchKeyword === "" ||
      site.keywords.some((keyword) => keyword.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      site.url.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      site.title?.toLowerCase().includes(searchKeyword.toLowerCase()),
  )

  if (!currentUrl) {
    return (
      <Card className="border-gray-200 bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="gradient-purple p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-serif font-black text-white text-lg">Competitor Landscape</h3>
              <p className="text-purple-100 text-sm font-medium">Identify your peers and learn from their strategies</p>
            </div>
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-purple-500" />
          </div>
          <p className="text-gray-600 font-medium">Find similar websites after capturing a snapshot</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-gray-200 bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="gradient-purple p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-serif font-black text-white text-lg">Competitor Landscape</h3>
            <p className="text-purple-100 text-sm font-medium">Explore similar websites and their metrics</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!hasSearched ? (
          <div className="space-y-4">
            <Button
              onClick={handleFindSimilar}
              className="w-full h-12 justify-center gap-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold text-base"
              disabled={isLoading}
            >
              <Globe className="w-5 h-5" />
              {isLoading ? "Finding Similar Sites..." : "Find Similar Sites"}
            </Button>

            <div className="p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-1">API Integration Required</p>
                  <p className="text-xs text-amber-700 font-medium">
                    This feature needs integration with a website similarity service (SimilarWeb, Alexa, or custom
                    analysis).
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Search by keywords or URL..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="flex-1 h-12 rounded-xl border-gray-300 font-medium"
              />
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse border-2 border-gray-200 rounded-xl p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="flex gap-2">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                      <div className="h-3 bg-gray-200 rounded w-14"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                <div className="text-xs text-gray-500 font-bold grid grid-cols-12 gap-3 px-4 py-3 border-b-2 border-gray-200 bg-gray-50 rounded-t-xl">
                  <div className="col-span-5">URL</div>
                  <div className="col-span-7">Keywords</div>
                </div>

                {filteredSites.map((site, index) => (
                  <div
                    key={index}
                    className="border-2 border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="grid grid-cols-12 gap-3 items-start">
                      <div className="col-span-5">
                        <button onClick={() => window.open(site.url, "_blank")} className="text-left group w-full">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="min-w-0">
                              {site.title && (
                                <p className="font-semibold text-sm text-gray-800 group-hover:text-purple-600 truncate">
                                  {site.title}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 group-hover:underline truncate font-medium">
                                {site.url}
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>

                      <div className="col-span-7">
                        <div className="flex flex-wrap gap-2">
                          {site.keywords.map((keyword, keywordIndex) => (
                            <span
                              key={keywordIndex}
                              className={`inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full border-2 font-medium ${
                                searchKeyword && keyword.toLowerCase().includes(searchKeyword.toLowerCase())
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  : "bg-gray-100 text-gray-600 border-gray-200"
                              }`}
                            >
                              <Tag className="w-2.5 h-2.5" />
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredSites.length === 0 && searchKeyword && (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500 font-medium">
                      No similar sites found matching "{searchKeyword}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {similarSites.length > 0 && (
              <div className="text-center pt-4 border-t-2 border-gray-200">
                <p className="text-xs text-gray-500 font-semibold">
                  Found {filteredSites.length} of {similarSites.length} similar websites
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
