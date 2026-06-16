import type { SiteSetting } from '@/payload-types'
import { mediaUrl } from '@/lib/accent'
import { RichInline } from './RichInline'

type Props = {
  variant: 'home' | 'discipline'
  settings: SiteSetting | null
  headline?: string | null
  /** Colophon right-hand label, e.g. "The Index · 07 disciplines" or "01 / 07 · Project Management". */
  colophon: string
}

/** Shared dark footer (#contact). Markup differs slightly between home and discipline. */
export function Footer({ variant, settings, headline, colophon }: Props) {
  const email = settings?.email ?? ''
  const phone = settings?.phone ?? ''
  const phoneHref = settings?.phoneHref ?? ''
  const location = settings?.location ?? ''
  const linkedin = settings?.linkedin ?? '#'
  const linkedinLabel = settings?.linkedinLabel ?? ''
  const copyright = settings?.copyright ?? ''
  const resume = mediaUrl(settings?.resume)
  const transparent = {
    background: 'transparent',
    color: 'var(--paper)',
    borderColor: 'rgba(255,255,255,.4)',
  }

  if (variant === 'home') {
    return (
      <footer className="foot" id="contact">
        <div className="wrap">
          <h3>
            <RichInline text={headline} />
          </h3>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a className="pill light" href={`mailto:${email}`}>
              Email me →
            </a>
            {resume && (
              <a className="pill" style={transparent} href={resume} target="_blank" rel="noopener">
                Download résumé
              </a>
            )}
            <a className="pill" style={transparent} href={linkedin} target="_blank" rel="noopener">
              LinkedIn
            </a>
          </div>
          <div className="cgrid">
            <a href={`mailto:${email}`}>
              <span className="k">Email</span>
              <span className="v">{email}</span>
            </a>
            <a href={`tel:${phoneHref}`}>
              <span className="k">Phone</span>
              <span className="v">{phone}</span>
            </a>
            <span>
              <span className="k">Based in</span>
              <span className="v">{location}</span>
            </span>
            <a href={linkedin} target="_blank" rel="noopener">
              <span className="k">Network</span>
              <span className="v">{linkedinLabel}</span>
            </a>
            {resume && (
              <a href={resume} target="_blank" rel="noopener">
                <span className="k">Résumé</span>
                <span className="v">Download PDF →</span>
              </a>
            )}
          </div>
          <div className="colo">
            <span>{copyright}</span>
            <span className="mono">{colophon}</span>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer className="foot" id="contact">
      <div className="page">
        <h3>
          <RichInline text={headline} />
        </h3>
        <div className="ctas">
          <a className="pill light" href={`mailto:${email}`}>
            {email} →
          </a>
          <a className="pill ghost" href={linkedin} target="_blank" rel="noopener">
            LinkedIn
          </a>
        </div>
        <div className="cgrid">
          <a href={`mailto:${email}`}>
            <div className="k">Email</div>
            <div className="v">{email}</div>
          </a>
          <a href={`tel:${phoneHref}`}>
            <div className="k">Phone</div>
            <div className="v">{phone}</div>
          </a>
          <div>
            <div className="k">Based in</div>
            <div className="v">{location}</div>
          </div>
          {resume && (
            <a href={resume} target="_blank" rel="noopener">
              <div className="k">Résumé</div>
              <div className="v">Download PDF →</div>
            </a>
          )}
          <a href="/">
            <div className="k">More</div>
            <div className="v">← All disciplines</div>
          </a>
        </div>
        <div className="colo">
          <span>{copyright}</span>
          <span className="mono">{colophon}</span>
        </div>
      </div>
    </footer>
  )
}
