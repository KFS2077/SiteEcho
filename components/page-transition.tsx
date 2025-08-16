"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    filter: "blur(10px)"
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)"
  },
  out: {
    opacity: 0,
    scale: 1.05,
    y: -20,
    filter: "blur(10px)"
  }
}

const pageTransition = {
  type: "tween",
  ease: [0.25, 0.46, 0.45, 0.94],
  duration: 0.4
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FancyPageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.8, 
        rotateX: -15,
        y: 50,
        filter: "blur(20px) brightness(0.8)"
      }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotateX: 0,
        y: 0,
        filter: "blur(0px) brightness(1)"
      }}
      exit={{ 
        opacity: 0, 
        scale: 1.1, 
        rotateX: 15,
        y: -50,
        filter: "blur(20px) brightness(1.2)"
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
        duration: 0.6
      }}
      className={className}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d"
      }}
    >
      {children}
    </motion.div>
  )
}