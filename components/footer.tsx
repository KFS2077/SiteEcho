"use client"

import { Heart } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SE</span>
            </div>
            <span className="font-semibold text-lg">SiteEcho</span>
          </div>
          
          <div className="text-center text-sm text-slate-300">
            <p className="flex items-center gap-3 justify-center">
              © {currentYear} URLinsights. Made with <Heart className="w-4 h-4 text-red-400 fill-current" /> for better insights.
            </p>
          </div>
          
          <div className="text-xs text-slate-400">
            <p>Powered by Vercel</p>
          </div>
        </div>
      </div>
    </footer>
  )
}