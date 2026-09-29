import type { MetadataRoute } from 'next'
import { getDisciplines } from '@/lib/data'

const BASE = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const disciplines = await getDisciplines().catch(() => [])
  const now = new Date()

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...disciplines.map((d) => ({
      url: `${BASE}/${d.slug}`,
      lastModified: d.updatedAt ? new Date(d.updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
