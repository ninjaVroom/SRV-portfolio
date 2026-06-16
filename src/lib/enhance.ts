/**
 * Small DOM enhancements shared by the home and discipline client shells.
 * These run inside useEffect on the client only.
 */

/** Intercept clicks on résumé (*.pdf) links and download via blob, with a new-tab fallback. */
export function attachResumeDownload(root: HTMLElement): () => void {
  const onClick = (e: Event) => {
    const target = e.target as HTMLElement
    const a = target.closest?.('a[href$=".pdf"]') as HTMLAnchorElement | null
    if (!a) return
    e.preventDefault()
    const href = a.getAttribute('href') || ''
    fetch(href)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.blob()
      })
      .then((b) => {
        const u = URL.createObjectURL(b)
        const t = document.createElement('a')
        t.href = u
        t.download = 'Samuel-Vroom-Resume.pdf'
        document.body.appendChild(t)
        t.click()
        t.remove()
        setTimeout(() => URL.revokeObjectURL(u), 5000)
      })
      .catch(() => window.open(a.href, '_blank', 'noopener'))
  }
  root.addEventListener('click', onClick)
  return () => root.removeEventListener('click', onClick)
}

/** Reveal elements with class `.rv` as they scroll into view (adds `.in`). */
export function revealRv(root: HTMLElement): () => void {
  const items = Array.from(root.querySelectorAll<HTMLElement>('.rv'))
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'))
    return () => {}
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      }),
    { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
  )
  items.forEach((el) => io.observe(el))
  return () => io.disconnect()
}
