'use client'

import { useState } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

/** Contact form (lives in the dark footer). Posts JSON to /api/contact. */
export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    setStatus('sending')
    setError('')
    const payload = Object.fromEntries(new FormData(form).entries())
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) throw new Error(json.error || 'Something went wrong. Please try again.')
      setStatus('sent')
      form.reset()
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <form className="cform" onSubmit={onSubmit} noValidate>
      <div className="cform-row">
        <label className="cfield">
          <span className="k">Name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" />
        </label>
        <label className="cfield">
          <span className="k">Email</span>
          <input type="email" name="email" required autoComplete="email" placeholder="you@example.com" />
        </label>
      </div>
      <label className="cfield">
        <span className="k">
          Subject <em>(optional)</em>
        </span>
        <input name="subject" autoComplete="off" placeholder="What's this about?" />
      </label>
      <label className="cfield">
        <span className="k">Message</span>
        <textarea name="message" required rows={4} placeholder="Tell me about the project…" />
      </label>

      {/* Honeypot — hidden from humans, catches bots. */}
      <input
        type="text"
        name="company"
        className="cform-hp"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="cform-actions">
        <button className="pill light" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message →'}
        </button>
        <p className="cform-status" role="status" aria-live="polite">
          {status === 'sent' && 'Thanks — your message is on its way.'}
          {status === 'error' && error}
        </p>
      </div>
    </form>
  )
}
