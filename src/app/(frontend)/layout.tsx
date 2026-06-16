import type { Metadata, Viewport } from 'next'

import '@/styles/tokens.css'
import '@/styles/discipline.css'
import '@/styles/home.css'

import { getHome, getSettings } from '@/lib/data'
import { mediaUrl } from '@/lib/accent'

export const viewport: Viewport = {
  themeColor: '#FAFAF8',
}

export async function generateMetadata(): Promise<Metadata> {
  const [home, settings] = await Promise.all([
    getHome().catch(() => null),
    getSettings().catch(() => null),
  ])
  const title = home?.title || 'Samuel Roland Vroom — Technical & Creative Project Manager'
  const description = home?.metaDescription || undefined
  const icon = mediaUrl(settings?.logo)

  return {
    title,
    description,
    metadataBase: process.env.NEXT_PUBLIC_SERVER_URL
      ? new URL(process.env.NEXT_PUBLIC_SERVER_URL)
      : undefined,
    openGraph: {
      title: home?.ogTitle || title,
      description: home?.ogDescription || description,
      type: 'website',
    },
    ...(icon ? { icons: { icon } } : {}),
  }
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
