"use client"

import { Card } from "@/components/ui/card"
import { Globe, Monitor, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { translations, type Language } from "@/lib/translations"

interface PreviewData {
  url: string
  title: string
  description: string
  favicon: string
  screenshot: string
  timestamp: Date
  keywords: string[]
}

interface PreviewPaneProps {
  preview: PreviewData | null
  isLoading: boolean
  language?: Language // Added language prop for translations
}

export function PreviewPane({ preview, isLoading, language = "en" }: PreviewPaneProps) {
  const [imageError, setImageError] = useState(false)
  const t = translations[language] // Added translation support

  if (isLoading) {
    return (
      <Card className="h-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <div className="h-full flex flex-col">
          {/* Browser Chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 mx-4">
              <div className="h-6 bg-slate-200 dark:bg-slate-600 rounded animate-pulse" />
            </div>
          </div>

          {/* Loading Content */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-300 font-medium">{t.capturingSnapshot}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t.thisMayTakeMoments}</p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (!preview) {
    return (
      <Card className="h-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Monitor className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">{t.noPreviewLoaded}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{t.pasteUrlPrompt}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Globe className="w-4 h-4" />
              <span>{t.secureSandboxPreview}</span>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="h-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Browser Chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex items-center gap-2 flex-1 mx-4">
            <img
              src={preview.favicon || "/placeholder.svg"}
              alt="Favicon"
              className="w-4 h-4"
              onError={(e) => {
                e.currentTarget.style.display = "none"
              }}
            />
            <div className="flex-1 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-600 rounded px-3 py-1 text-sm text-slate-600 dark:text-slate-300 truncate">
              {preview.url}
            </div>
          </div>
        </div>

        {/* Screenshot Content */}
        <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-700">
          {imageError ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-300 font-medium">{t.failedToLoadScreenshot}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t.websiteMayBeBlocking}</p>
              </div>
            </div>
          ) : (
            <img
              src={preview.screenshot || "/placeholder.svg"}
              alt={`Screenshot of ${preview.url}`}
              className="w-full h-auto"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
          )}
        </div>
      </div>
    </Card>
  )
}
