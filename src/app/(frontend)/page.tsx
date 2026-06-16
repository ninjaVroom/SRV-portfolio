import type { CSSProperties } from 'react'

import { HomeShell } from '@/components/HomeShell'
import { TopBar } from '@/components/TopBar'
import { Footer } from '@/components/Footer'
import { RichInline } from '@/components/RichInline'
import { getDisciplines, getHome, getSettings } from '@/lib/data'
import { accentVar } from '@/lib/accent'

export default async function HomePage() {
  const [home, settings, disciplines] = await Promise.all([
    getHome(),
    getSettings(),
    getDisciplines(),
  ])

  return (
    <HomeShell>
      <a className="skip" href="#work">
        Skip to work
      </a>

      <TopBar variant="home" settings={settings} />

      <main>
        <section className="masthead wrap">
          <div className="eyebrow">
            {(home?.eyebrow ?? []).map((e, i) => (
              <span className="mono" key={i}>
                {e.text}
              </span>
            ))}
          </div>

          <h1 className="name">
            {(home?.nameLines ?? []).map((l, i) => (
              <span className="ln" key={i}>
                <span>{l.text}</span>
              </span>
            ))}
          </h1>

          <p className="lede">
            <RichInline text={home?.lede} />
          </p>

          <div className="facts">
            {(home?.facts ?? []).map((f, i) => (
              <div className="fact" key={i}>
                <b>{f.value}</b>
                <span>{f.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="wrap" id="work">
          <div className="index-head">
            <h2>{home?.indexHeading || 'The Index — Select a discipline'}</h2>
            <span className="mono hint">Hover to preview</span>
          </div>

          <div className="index">
            {disciplines.map((d) => (
              <a
                className="row"
                key={d.id}
                href={`/${d.slug}`}
                data-accent={accentVar(d.accent)}
                data-label={d.title}
                style={{ '--row-accent': accentVar(d.accent) } as CSSProperties}
              >
                <span className="num">{d.number}</span>
                <h3 className="ttl">
                  {d.title}
                  {d.featured && <span className="feat">Primary focus</span>}
                </h3>
                <span className="meta">
                  <span className="role">{d.indexRole}</span>
                  <span className="tools">{d.indexTools}</span>
                </span>
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>

      <Footer
        variant="home"
        settings={settings}
        headline={home?.footerHeadline}
        colophon="The Index · 07 disciplines"
      />
    </HomeShell>
  )
}
