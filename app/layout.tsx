import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Open_Sans } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"], // Added black weight for headings
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "SiteEcho",
  description: "SiteEcho is a powerful web analysis platform offering comprehensive keyword insights, site search capabilities, competitor discovery, and SEO optimization tools for modern websites.",
  keywords: ["web analysis", "SEO tools", "keyword research", "competitor analysis", "site search", "website insights", "digital marketing"],
  authors: [{ name: "SiteEcho Team" }],
  creator: "SiteEcho",
  publisher: "SiteEcho",
  robots: "index, follow",
  openGraph: {
    title: "SiteEcho",
    description: "Powerful web analysis platform for keyword insights, competitor discovery, and SEO optimization.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SiteEcho",
    description: "Powerful web analysis platform for keyword insights, competitor discovery, and SEO optimization.",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "SiteEcho",
    "description": "Advanced web analysis platform for keyword insights, competitor discovery, and SEO optimization.",
    "url": "https://site-echo-ide.vercel.app/",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Keyword Analysis",
      "Site Search",
      "Competitor Discovery",
      "SEO Insights",
      "Web Analysis"
    ]
  }

  return (
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${openSans.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
