import type { CSSProperties } from 'react'

export default function NotFound() {
  return (
    <main className="page" style={{ paddingBlock: 'clamp(80px,18vh,200px)' } as CSSProperties}>
      <div className="crumb" style={{ marginBottom: 26 }}>
        <span className="n" style={{ ['--accent' as string]: 'var(--ink)' } as CSSProperties}>
          404
        </span>
        <a className="c" href="/">
          Index
        </a>
        <span className="c">/ Not found</span>
      </div>
      <h1 className="dtitle" style={{ ['--accent' as string]: 'var(--ink)' } as CSSProperties}>
        Page
        <br />
        not found
      </h1>
      <p className="dintro">
        That page doesn’t exist. Head back to <a href="/" style={{ textDecoration: 'underline', textUnderlineOffset: 4 }}>The Index</a>.
      </p>
    </main>
  )
}
