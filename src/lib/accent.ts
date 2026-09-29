import type { Media } from '@/payload-types'

/** Discipline accent key → the CSS custom property from tokens.css. */
export const ACCENT_VARS = {
  pm: 'var(--a-pm)',
  web: 'var(--a-web)',
  mobile: 'var(--a-mobile)',
  design: 'var(--a-design)',
  video: 'var(--a-video)',
  write: 'var(--a-write)',
  screen: 'var(--a-screen)',
} as const

export type AccentKey = keyof typeof ACCENT_VARS

/** Resolve a discipline accent to its CSS var, falling back to ink. */
export function accentVar(accent?: string | null): string {
  return (accent && ACCENT_VARS[accent as AccentKey]) || 'var(--ink)'
}

/** Pull a usable URL out of an upload field that may be an id, a Media object, or null. */
export function mediaUrl(value: number | Media | null | undefined): string | null {
  return value && typeof value === 'object' ? (value.url ?? null) : null
}
