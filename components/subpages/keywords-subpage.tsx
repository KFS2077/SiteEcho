"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Tag, Loader2, AlertCircle, Download, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface PreviewData {
  url: string
  title: string
  description: string
  screenshot: string
  favicon: string
  keywords: string[]
  timestamp: string
}

interface KeywordsSubpageProps {
  previewData: PreviewData | null
}

export function KeywordsSubpage({ previewData }: KeywordsSubpageProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const extractedKeywords = useMemo(() => {
    if (!previewData) return []
    const text = `${previewData.title} ${previewData.description}`
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
    const words = text.split(/\s+/).filter((w) => w.length > 3)
    const freqMap: Record<string, number> = {}

    for (const w of words) freqMap[w] = (freqMap[w] || 0) + 1
    return Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([w]) => w)
  }, [previewData])

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => setIsAnalyzing(false), 1000)
  }

  if (!previewData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-200/50 dark:border-slate-700/50"
      >
        <AlertCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">No Analysis Yet</h3>
        <p className="text-slate-500 dark:text-slate-400">Analyze a website to generate keywords</p>
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
        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
          <Tag className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Extracted Keywords</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Keywords detected from the page content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2 bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">Top Keywords</h4>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-200 dark:border-slate-700"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" /> Analyzing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" /> Analyze Again
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline" className="border-slate-200 dark:border-slate-700">
                  <Download className="w-4 h-4 mr-2" /> Export
                </Button>
              </div>
            </div>

            {extractedKeywords.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">No keywords detected from the page content</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {extractedKeywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-3 py-1 text-sm rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
          <CardContent className="p-6">
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">Page Info</h4>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <span className="font-medium">Title: </span>
                <span>{previewData.title}</span>
              </div>
              <div>
                <span className="font-medium">Description: </span>
                <span>{previewData.description || "-"}</span>
              </div>
              <div>
                <span className="font-medium">URL: </span>
                <span>{previewData.url}</span>
              </div>
              <div>
                <span className="font-medium">Timestamp: </span>
                <span>{new Date(previewData.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
}
