"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface CubeButtonProps {
  className?: string
  onClick?: () => void
}

export function CubeButton({ className = "", onClick }: CubeButtonProps) {
  const [isRotating, setIsRotating] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    setIsRotating(true)
    
    if (onClick) {
      onClick()
    } else {
      // Default behavior: navigate to cube demo page
      setTimeout(() => {
        router.push("/cube-demo")
      }, 800)
    }
    
    setTimeout(() => {
      setIsRotating(false)
    }, 1500)
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <motion.div
        className="relative w-16 h-16 cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={handleClick}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* 3D Cube */}
        <motion.div
          className="relative w-full h-full preserve-3d"
          animate={{
            rotateX: isRotating ? [0, 360] : [0, 10, -10, 0],
            rotateY: isRotating ? [0, 360] : [0, -10, 10, 0],
          }}
          transition={{
            duration: isRotating ? 1.5 : (isHovering ? 2 : 4),
            ease: isRotating ? "easeInOut" : "easeInOut",
            repeat: isRotating ? 0 : Infinity,
            repeatType: "loop",
          }}
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front Face */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-xl border-2 border-white/20 flex items-center justify-center text-white font-bold text-sm"
               style={{ transform: "translateZ(32px)" }}>
            ✨
          </div>
          
          {/* Back Face */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-xl border-2 border-white/20 flex items-center justify-center text-white font-bold text-sm"
               style={{ transform: "translateZ(-32px) rotateY(180deg)" }}>
            🚀
          </div>
          
          {/* Right Face */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-xl border-2 border-white/20 flex items-center justify-center text-white font-bold text-sm"
               style={{ transform: "rotateY(90deg) translateZ(32px)" }}>
            🎯
          </div>
          
          {/* Left Face */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-xl border-2 border-white/20 flex items-center justify-center text-white font-bold text-sm"
               style={{ transform: "rotateY(-90deg) translateZ(32px)" }}>
            🌟
          </div>
          
          {/* Top Face */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg shadow-xl border-2 border-white/20 flex items-center justify-center text-white font-bold text-sm"
               style={{ transform: "rotateX(90deg) translateZ(32px)" }}>
            🎨
          </div>
          
          {/* Bottom Face */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-xl border-2 border-white/20 flex items-center justify-center text-white font-bold text-sm"
               style={{ transform: "rotateX(-90deg) translateZ(32px)" }}>
            🔮
          </div>
        </motion.div>
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-600/20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: isHovering ? 1 : 2,
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      </motion.div>
    </div>
  )
}