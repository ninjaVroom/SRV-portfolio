'use client'

import type { CSSProperties } from 'react'
import { useEffect, useRef } from 'react'
import { attachResumeDownload, revealRv } from '@/lib/enhance'

/**
 * Discipline interactive shell: sets the page `--accent`, adds the `loaded`
 * reveal (hero rule), reveals `.rv` sections on scroll, and wires résumé
 * downloads. SSR shows the resting markup; this only enhances.
 */
export function DisciplineShell({ accent, children }: { accent: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const raf = requestAnimationFrame(() => root.classList.add('loaded'))
    const detachReveal = revealRv(root)
    const detachResume = attachResumeDownload(root)
    return () => {
      cancelAnimationFrame(raf)
      detachReveal()
      detachResume()
    }
  }, [])

  return (
    <div ref={ref} style={{ '--accent': accent } as CSSProperties}>
      {children}
    </div>
  )
}
