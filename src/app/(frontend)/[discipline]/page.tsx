import type { Metadata } from 'next'
import { Fragment } from 'react'
import { notFound } from 'next/navigation'

import { DisciplineShell } from '@/components/DisciplineShell'
import { TopBar } from '@/components/TopBar'
import { Footer } from '@/components/Footer'
import { RichInline } from '@/components/RichInline'
import { getDiscipline, getDisciplines, getSettings } from '@/lib/data'
import { accentVar, mediaUrl } from '@/lib/accent'

type Params = { params: Promise<{ discipline: string }> }

export async function generateStaticParams() {
  const disciplines = await getDisciplines().catch(() => [])
  return disciplines.map((d) => ({ discipline: d.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { discipline } = await params
  const d = await getDiscipline(discipline)
  if (!d) return {}
  return {
    title: `${d.title} — Samuel Roland Vroom`,
    description: d.metaDescription || undefined,
  }
}

export default async function DisciplinePage({ params }: Params) {
  const { discipline } = await params
  const [d, settings, all] = await Promise.all([
    getDiscipline(discipline),
    getSettings(),
    getDisciplines(),
  ])
  if (!d) notFound()

  const n = all.length
  const idx = all.findIndex((x) => x.slug === d.slug)
  const prev = n > 1 ? all[(idx - 1 + n) % n] : null
  const next = n > 1 ? all[(idx + 1) % n] : null

  const letter = (i: number) => String.fromCharCode(97 + i)
  const titleLines = d.titleLines?.length ? d.titleLines.map((t) => t.text) : [d.title]

  return (
    <DisciplineShell accent={accentVar(d.accent)}>
      <TopBar variant="discipline" settings={settings} />

      <main>
        <section className="dhero page">
          <div className="crumb">
            <span className="n">{d.number}</span>
            <a className="c" href="/">
              Index
            </a>
            <span className="c">/ {d.title}</span>
          </div>
          <h1 className="dtitle">
            {titleLines.map((t, i) => (
              <Fragment key={i}>
                {i > 0 && <br />}
                {t}
              </Fragment>
            ))}
          </h1>
          <p className="dtag">{d.tag}</p>
          <p className="dintro">
            <RichInline text={d.intro} />
          </p>
          <div className="hrule" />
        </section>

        <section className="sec page">
          <div className="sec-head">
            <span className="ey">01 — What I do</span>
            <h2>{d.capabilitiesHeading || 'Capabilities'}</h2>
          </div>
          <div className="caps">
            {(d.capabilities ?? []).map((c, i) => (
              <div className="cap rv" key={i}>
                <div className="ci">{letter(i)}</div>
                <h3>{c.title}</h3>
                <p>{c.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="sec page">
          <div className="sec-head">
            <span className="ey">02 — Selected work</span>
            <h2>{d.workHeading}</h2>
          </div>
          <div className="work">
            {(d.projects ?? []).map((p, i) => {
              const img = mediaUrl(p.image)
              return (
                <a className="proj rv" key={i} href={p.link || '#'}>
                  <div className="shot">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={p.title} />
                    ) : (
                      <div className="ph">
                        <span className="tag">{p.placeholderTag}</span>
                      </div>
                    )}
                  </div>
                  <div className="pmeta">
                    <h3>{p.title}</h3>
                    {p.year && <span className="yr">{p.year}</span>}
                  </div>
                  {p.role && <div className="role">{p.role}</div>}
                  {p.description && <p>{p.description}</p>}
                </a>
              )
            })}
          </div>
        </section>

        <section className="sec page">
          <div className="proof rv">
            <div className="big">{d.proofBig}</div>
            <div>
              <div className="pt">{d.proofLabel}</div>
              <div className="pd">
                <RichInline text={d.proofDescription} />
              </div>
            </div>
          </div>
        </section>

        <section className="sec page">
          <div className="sec-head">
            <span className="ey">03 — Stack</span>
            <h2>{d.toolsHeading || 'Tools of the trade'}</h2>
          </div>
          <div className="tools">
            {(d.tools ?? []).map((t, i) => (
              <span className="tool" key={i}>
                {t.name}
              </span>
            ))}
          </div>
        </section>
      </main>

      {prev && next && (
        <nav className="pn">
          <a className="prev" href={`/${prev.slug}`}>
            <span className="fill" style={{ background: accentVar(prev.accent) }} />
            <span className="k">← Prev · {prev.number}</span>
            <span className="t">{prev.title}</span>
          </a>
          <a className="next" href={`/${next.slug}`}>
            <span className="fill" style={{ background: accentVar(next.accent) }} />
            <span className="k">Next · {next.number} →</span>
            <span className="t">{next.title}</span>
          </a>
        </nav>
      )}

      <Footer
        variant="discipline"
        settings={settings}
        headline={d.footerHeadline}
        colophon={`${d.number} / 07 · ${d.title}`}
      />
    </DisciplineShell>
  )
}
