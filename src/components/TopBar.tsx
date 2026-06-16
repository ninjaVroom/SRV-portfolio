import type { SiteSetting } from '@/payload-types'
import { mediaUrl } from '@/lib/accent'

type Props = {
  variant: 'home' | 'discipline'
  settings: SiteSetting | null
}

/**
 * Shared sticky top bar.
 * - home: brand + availability status + Résumé + "Get in touch"
 * - discipline: brand + "← The Index" backchip + "Hire me" CTA
 */
export function TopBar({ variant, settings }: Props) {
  const name = settings?.name ?? 'Samuel Roland Vroom'
  const logo = mediaUrl(settings?.logo)
  const resume = mediaUrl(settings?.resume)
  const availability = settings?.availability ?? 'Available'

  return (
    <header className="topbar">
      <a className="brand" href="/">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="monogram" src={logo} alt={`SRV monogram — ${name}`} />
        ) : (
          <span className="monogram" aria-hidden="true" />
        )}
        <b>{name}</b>
      </a>
      <div className="right">
        {variant === 'home' ? (
          <>
            <span className="status mono">
              <span className="dot" />
              <span className="label">{availability}</span>
            </span>
            {resume && (
              <a className="pill pill--ghost" href={resume} target="_blank" rel="noopener">
                Résumé
              </a>
            )}
            <a className="pill" href="#contact">
              Get in touch
            </a>
          </>
        ) : (
          <>
            <a className="backchip" href="/">
              ← The Index
            </a>
            <a className="pill cta" href="#contact">
              Hire me
            </a>
          </>
        )}
      </div>
    </header>
  )
}
