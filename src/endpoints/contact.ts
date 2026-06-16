import type { Endpoint, PayloadRequest } from 'payload'
import { addDataAndFileToRequest } from 'payload'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/**
 * POST /api/contact — public contact form handler.
 * Validates, drops honeypot bots, persists a Message, and best-effort emails a
 * notification (never failing the submission if mail delivery is unavailable).
 */
export const contactEndpoint: Endpoint = {
  path: '/contact',
  method: 'post',
  handler: async (req: PayloadRequest) => {
    await addDataAndFileToRequest(req)
    const body = (req.data ?? {}) as Record<string, string>

    const name = (body.name ?? '').trim()
    const email = (body.email ?? '').trim()
    const subject = (body.subject ?? '').trim()
    const message = (body.message ?? '').trim()
    const honeypot = (body.company ?? '').trim()

    // Honeypot field is invisible to humans; if filled, silently accept (don't tip off bots).
    if (honeypot) return Response.json({ ok: true })

    if (!name || !email || !message) {
      return Response.json(
        { error: 'Please fill in your name, email, and message.' },
        { status: 400 },
      )
    }
    if (!EMAIL_RE.test(email)) {
      return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (message.length > 5000) {
      return Response.json({ error: 'That message is a little long — please trim it.' }, { status: 400 })
    }

    const doc = await req.payload.create({
      collection: 'messages',
      data: {
        name,
        email,
        subject: subject || undefined,
        message,
        userAgent: req.headers.get('user-agent') || undefined,
      },
      overrideAccess: true,
    })

    try {
      const settings = await req.payload.findGlobal({ slug: 'site-settings' })
      const to = process.env.CONTACT_TO || settings?.email || undefined
      if (to) {
        await req.payload.sendEmail({
          to,
          replyTo: `${name} <${email}>`,
          subject: `Portfolio enquiry — ${name}${subject ? ` · ${subject}` : ''}`,
          text: `From: ${name} <${email}>\n${subject ? `Subject: ${subject}\n` : ''}\n${message}`,
          html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>${
            subject ? `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` : ''
          }<p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
        })
      }
    } catch (err) {
      req.payload.logger.error({ err }, 'Contact notification email failed')
    }

    return Response.json({ ok: true, id: doc.id })
  },
}
