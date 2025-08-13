"use client"

import { motion } from "framer-motion"
import { Copy, TrendingUp } from "lucide-react"
import { useState } from "react"
import { translations, type Language } from "@/lib/translations"

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
  language: Language // Add language prop
}

export function KeywordsSubpage({ previewData, language }: KeywordsSubpageProps) {
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null)
  const t = translations[language] // Use translations

  const handleCopyKeyword = async (keyword: string) => {
    try {
      await navigator.clipboard.writeText(keyword)
      setCopiedKeyword(keyword)
      setTimeout(() => setCopiedKeyword(null), 2000)
    } catch (error) {
      console.error("Failed to copy keyword:", error)
    }
  }

  if (!previewData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-slate-200/50 dark:border-slate-700/50"
      >
        <TrendingUp className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">{t.noAnalysisYet}</h3>
        <p className="text-slate-500 dark:text-slate-400">{t.analyzeWebsitePrompt}</p>
      </motion.div>
    )
  }

  const keywords = previewData.keywords || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{t.extractedKeywords}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.from} {previewData.title}
            </p>
          </div>
        </div>
      </div>

      {keywords.length > 0 ? (
        <div className="flex flex-wrap gap-3">
          {keywords.map((keyword, index) => (
            <motion.button
              key={keyword}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCopyKeyword(keyword)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                copiedKeyword === keyword
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                  : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600"
              } border`}
            >
              <span className="flex items-center gap-2">
                {keyword}
                {copiedKeyword === keyword ? (
                  <span className="text-xs">✓</span>
                ) : (
                  <Copy className="w-3 h-3 opacity-50" />
                )}
              </span>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">{t.noKeywords}</p>
        </div>
      )}
    </motion.div>
  )
}
