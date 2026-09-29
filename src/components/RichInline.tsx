import React from 'react'

/**
 * Renders a string that may contain literal <em>…</em> and <strong>…</strong>
 * markers (the only two tags used in the CMS copy) into real React elements.
 * Everything else is treated as plain text — no arbitrary HTML is injected.
 */
export function RichInline({ text }: { text?: string | null }): React.ReactNode {
  if (!text) return null
  return <>{parseInline(text)}</>
}

function parseInline(text: string): React.ReactNode[] {
  const parts = text.split(/(<\/?(?:em|strong)>)/g)
  const out: React.ReactNode[] = []
  const stack: { tag: 'em' | 'strong'; children: React.ReactNode[] }[] = []
  let key = 0

  const push = (node: React.ReactNode) => {
    if (stack.length) stack[stack.length - 1].children.push(node)
    else out.push(node)
  }
  const close = () => {
    const top = stack.pop()
    if (!top) return
    const Tag = top.tag
    push(<Tag key={key++}>{top.children}</Tag>)
  }

  for (const part of parts) {
    if (part === '<em>' || part === '<strong>') {
      stack.push({ tag: part === '<em>' ? 'em' : 'strong', children: [] })
    } else if (part === '</em>' || part === '</strong>') {
      close()
    } else if (part) {
      push(part)
    }
  }
  while (stack.length) close() // flush any unclosed tags defensively
  return out
}
