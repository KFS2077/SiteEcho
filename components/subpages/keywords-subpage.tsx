"use client"

import { motion } from "framer-motion"
import { Tag, RefreshCcw, Download, Info, Globe } from "lucide-react"
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

interface KeywordsSubpageProps {
  previewData: PreviewData | null
}

export function KeywordsSubpage({ previewData }: KeywordsSubpageProps) {
  if (!previewData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-200/50 dark:border-slate-700/50"
      >
        <Tag className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">No Keywords Available</h3>
        <p className="text-slate-500 dark:text-slate-400">Analyze a website to extract keywords</p>
      </motion.div>
    )
  }

  const tags = previewData.keywords?.length ? previewData.keywords : [
    "website", "under", "construction", "preview", "perception", "index"
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
          <Tag className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Extracted Keywords</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Keywords detected from the page content</p>
        </div>
      </div>

      {/* Two-panel layout with vertical separators aligned */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Top Keywords */}
        <div className="lg:col-span-2">
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">Top Keywords</h4>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span className="text-xs">Analyze Again</span>
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Download className="w-3.5 h-3.5" />
                  <span className="text-xs">Export</span>
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Page Info */}
        <div className="lg:col-span-1">
          <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-slate-500" />
              <h4 className="font-semibold text-slate-800 dark:text-slate-100">Page Info</h4>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-500 dark:text-slate-400">Title:</p>
                <p className="text-slate-800 dark:text-slate-200 truncate">{previewData.title || "Website Under Construction"}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">Description:</p>
                <p className="text-slate-800 dark:text-slate-200 line-clamp-3">{previewData.description || "Website preview of agi-perception-index.com"}</p>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400">URL:</p>
                <a
                  href={previewData.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  {previewData.url}
                </a>
              </div>
              <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400">Detected Keywords Count</p>
                <p className="text-slate-800 dark:text-slate-200">{tags.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
