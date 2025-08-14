"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Clock, Shield } from "lucide-react"

interface PreviewData {
  url: string
  title: string
  description: string
  favicon: string
  screenshot: string
  timestamp: Date
  safetyStatus: "safe" | "warning" | "danger"
}

interface HistoryDrawerProps {
  isOpen: boolean
  history: PreviewData[]
  onSelect: (preview: PreviewData) => void
  onClose: () => void
}

export function HistoryDrawer({ isOpen, history, onSelect, onClose }: HistoryDrawerProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-[420px] border-l border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition-transform duration-300 z-40 translate-x-0">
      <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-800 dark:text-slate-100">History</h3>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
          <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
      </div>

      <div className="overflow-auto" style={{ height: "calc(100% - 65px)" }}>
        {history.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">No history yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Previewed sites will appear here</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {history.map((item) => (
              <button
                key={`${item.url}-${item.timestamp.toString()}`}
                onClick={() => onSelect(item)}
                className="w-full text-left group"
              >
                <Card className="p-3 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/60 transition-all duration-200 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-900/10">
                  <div className="flex gap-3">
                    <div className="w-16 h-12 bg-slate-100 dark:bg-slate-700 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.screenshot || "/placeholder.svg"}
                        alt={`Thumbnail of ${item.url}`}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.currentTarget.src = "/website-thumbnail.png"
                        }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-sm text-slate-800 dark:text-slate-100 truncate">{item.title}</h4>
                        <Badge
                          variant={item.safetyStatus === "safe" ? "default" : "destructive"}
                          className="text-xs flex-shrink-0"
                        >
                          <Shield className="w-3 h-3" />
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 truncate mb-2">{item.url}</p>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • {item.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
