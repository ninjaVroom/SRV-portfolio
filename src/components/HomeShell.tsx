'use client'

import { useEffect, useRef } from 'react'
import { attachResumeDownload } from '@/lib/enhance'

/**
 * Home interactive shell: wraps the server-rendered home markup, adds the
 * entrance `loaded` reveal, staggers the index rows in, drives the
 * cursor-following preview, and wires résumé downloads. SSR shows the resting
 * markup; this only enhances.
 */
export function HomeShell({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = ref.current
    const prev = previewRef.current
    const label = labelRef.current
    if (!root || !prev || !label) return

    const raf = requestAnimationFrame(() => root.classList.add('loaded'))

    const rows = Array.from(root.querySelectorAll<HTMLElement>('.row'))
    const timers = rows.map((r, i) => window.setTimeout(() => r.classList.add('in'), 350 + i * 70))

    const ph = prev.querySelector<HTMLElement>('.ph')
    const onEnter = (r: HTMLElement) => () => {
      ph?.style.setProperty('--ph-accent', r.dataset.accent || 'var(--ink)')
      label.textContent = `${r.dataset.label || ''} — visual`
      prev.classList.add('on')
    }
    const onLeave = () => prev.classList.remove('on')
    const enterHandlers = rows.map((r) => {
      const h = onEnter(r)
      r.addEventListener('mouseenter', h)
      r.addEventListener('mouseleave', onLeave)
      return h
    })

    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      rafId: number | null = null
    const loop = () => {
      tx += (cx - tx) * 0.18
      ty += (cy - ty) * 0.18
      prev.style.left = `${tx}px`
      prev.style.top = `${ty}px`
      rafId = Math.abs(cx - tx) > 0.4 || Math.abs(cy - ty) > 0.4 ? requestAnimationFrame(loop) : null
    }
    const onMove = (e: MouseEvent) => {
      cx = e.clientX
      cy = e.clientY
      if (rafId === null) loop()
    }
    window.addEventListener('mousemove', onMove)

    const detachResume = attachResumeDownload(root)

    return () => {
      cancelAnimationFrame(raf)
      timers.forEach((t) => clearTimeout(t))
      rows.forEach((r, i) => {
        r.removeEventListener('mouseenter', enterHandlers[i])
        r.removeEventListener('mouseleave', onLeave)
      })
      window.removeEventListener('mousemove', onMove)
      if (rafId !== null) cancelAnimationFrame(rafId)
      detachResume()
    }
  }, [])

  return (
    <div className="home" ref={ref}>
      {children}
      <div className="preview" ref={previewRef} aria-hidden="true">
        <div className="ph">
          <span ref={labelRef}>Preview</span>
        </div>
      </div>
    </div>
  )
}
