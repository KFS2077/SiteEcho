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
    <div className="w-80 flex-shrink-0">
      <Card className="h-full border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-800">History</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 hover:bg-slate-100">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="overflow-auto" style={{ height: "calc(100% - 73px)" }}>
          {history.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-600">No history yet</p>
              <p className="text-xs text-slate-500 mt-1">Previewed sites will appear here</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {history.map((item, index) => (
                <button
                  key={`${item.url}-${item.timestamp.getTime()}`}
                  onClick={() => onSelect(item)}
                  className="w-full text-left group"
                >
                  <Card className="p-3 border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 group-hover:bg-blue-50/50">
                    <div className="flex gap-3">
                      <div className="w-16 h-12 bg-slate-100 rounded overflow-hidden flex-shrink-0">
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
                          <h4 className="font-medium text-sm text-slate-800 truncate">{item.title}</h4>
                          <Badge
                            variant={item.safetyStatus === "safe" ? "default" : "destructive"}
                            className="text-xs flex-shrink-0"
                          >
                            <Shield className="w-3 h-3" />
                          </Badge>
                        </div>

                        <p className="text-xs text-slate-600 truncate mb-2">{item.url}</p>

                        <p className="text-xs text-slate-500">
                          {item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} •{" "}
                          {item.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
