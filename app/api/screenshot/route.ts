import { type NextRequest, NextResponse } from "next/server"

// Blank white SVG data URL used as a temporary screenshot placeholder
const BLANK_SVG_DATA =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="100%" height="100%" fill="white"/></svg>'
  )

 const mockData = [
   {
     screenshot: "/modern-website-homepage.png",
     keywords: [
       "technology",
       "innovation",
       "digital",
       "solutions",
       "modern",
       "web",
       "design",
       "development",
       "business",
       "services",
     ],
     title: "TechCorp - Digital Solutions",
     description: "Leading provider of innovative digital solutions for modern businesses",
   },
  {
    screenshot: "/project-2.png",
    keywords: [
      "ecommerce",
      "shopping",
      "products",
      "retail",
      "online",
      "store",
      "fashion",
      "clothing",
      "accessories",
      "sale",
    ],
    title: "ShopHub - Online Store",
    description: "Your one-stop destination for fashion and lifestyle products",
  },
  {
    screenshot: "/blog-website.png",
    keywords: [
      "blog",
      "articles",
      "content",
      "writing",
      "news",
      "stories",
      "lifestyle",
      "travel",
      "food",
      "photography",
    ],
    title: "LifeStyle Blog",
    description: "Discover amazing stories about travel, food, and lifestyle",
  },
  {
    screenshot: "/placeholder-4m5ej.png",
    keywords: [
      "portfolio",
      "creative",
      "design",
      "artwork",
      "photography",
      "graphic",
      "visual",
      "artist",
      "showcase",
      "gallery",
    ],
    title: "Creative Portfolio",
    description: "Showcasing creative work and artistic vision",
  },
  {
    screenshot: "/corporate-website-layout.png",
    keywords: [
      "corporate",
      "business",
      "professional",
      "services",
      "consulting",
      "finance",
      "enterprise",
      "solutions",
      "strategy",
      "growth",
    ],
    title: "Business Corp",
    description: "Professional business consulting and enterprise solutions",
  },
]

async function extractKeywords(url: string, html: string): Promise<string[]> {
  try {
    // Extract text content from HTML
    const textContent = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    // Extract keywords from meta tags
    const keywordsMeta = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']+)["']/i)
    const metaKeywords = keywordsMeta ? keywordsMeta[1].split(",").map((k) => k.trim()) : []

    // Simple keyword extraction from content
    const words = textContent
      .toLowerCase()
      .split(/\W+/)
      .filter((word) => word.length > 3 && word.length < 20)
      .filter(
        (word) =>
          ![
            "this",
            "that",
            "with",
            "have",
            "will",
            "from",
            "they",
            "been",
            "were",
            "said",
            "each",
            "which",
            "their",
            "time",
            "more",
            "very",
            "what",
            "know",
            "just",
            "first",
            "into",
            "over",
            "think",
            "also",
            "your",
            "work",
            "life",
            "only",
            "can",
            "still",
            "should",
            "after",
            "being",
            "now",
            "made",
            "before",
            "here",
            "through",
            "when",
            "where",
            "much",
            "some",
            "these",
            "many",
            "would",
            "there",
          ].includes(word),
      )

    // Count word frequency
    const wordCount: { [key: string]: number } = {}
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })

    // Get top keywords
    const topKeywords = Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)
      .map(([word]) => word)

    return [...new Set([...metaKeywords, ...topKeywords])].slice(0, 20)
  } catch (error) {
    return []
  }
}

async function extractMetadata(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "WebPreview Bot 1.0",
      },
    })

    const html = await response.text()

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : new URL(url).hostname

    // Extract description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
    const description = descMatch ? descMatch[1].trim() : `Website preview of ${new URL(url).hostname}`

    const keywords = await extractKeywords(url, html)

    return { title, description, keywords }
  } catch (error) {
    const hostname = new URL(url).hostname
    return {
      title: hostname,
      description: `Website preview of ${hostname}`,
      keywords: [],
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    const randomMock = mockData[Math.floor(Math.random() * mockData.length)]

    try {
      const metadata = await extractMetadata(url)

      return NextResponse.json({
        screenshot: BLANK_SVG_DATA,
         title: metadata.title || randomMock.title,
         description: metadata.description || randomMock.description,
         favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`,
         keywords: metadata.keywords.length > 0 ? metadata.keywords : randomMock.keywords,
         timestamp: new Date().toISOString(),
       })
     } catch (error) {
       return NextResponse.json({
        screenshot: BLANK_SVG_DATA,
         title: randomMock.title,
         description: randomMock.description,
         favicon: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`,
         keywords: randomMock.keywords,
         timestamp: new Date().toISOString(),
       })
     }
   } catch (error) {
     console.error("Screenshot API error:", error)
     return NextResponse.json({ error: "Failed to capture screenshot" }, { status: 500 })
   }
 }
