"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function CubeDemoPage() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    setShow(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-white dark:hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">Cube Transition Demo</h1>
          <div />
        </div>

        <div className="relative h-[70vh] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60">
          <AnimatePresence initial={false}>
            {show ? (
              <motion.div
                key="panel-a"
                className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white"
                style={{ perspective: 1200, transformStyle: "preserve-3d" }}
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">A</div>
              </motion.div>
            ) : (
              <motion.div
                key="panel-b"
                className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white"
                style={{ perspective: 1200, transformStyle: "preserve-3d" }}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">B</div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <button
              onClick={() => setShow((s) => !s)}
              className="px-4 py-2 rounded-xl bg-slate-900/80 text-white shadow hover:bg-slate-900"
            >
              Toggle Cube Transition
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}