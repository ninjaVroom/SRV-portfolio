import type { GlobalConfig } from 'payload'

export const HomeContent: GlobalConfig = {
  slug: 'home',
  label: 'Home Page',
  admin: { group: 'Content' },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', admin: { description: 'SEO <title>.' } },
    { name: 'metaDescription', type: 'textarea' },
    {
      type: 'row',
      fields: [
        { name: 'ogTitle', type: 'text', admin: { width: '50%' } },
        { name: 'ogDescription', type: 'textarea', admin: { width: '50%' } },
      ],
    },
    {
      name: 'eyebrow',
      type: 'array',
      labels: { singular: 'Eyebrow item', plural: 'Eyebrow items' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'nameLines',
      type: 'array',
      labels: { singular: 'Name line', plural: 'Name lines' },
      admin: { description: 'Masthead name split across lines, e.g. “Samuel” / “R. Vroom”.' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    { name: 'lede', type: 'textarea', admin: { description: 'Masthead lede. <em>…</em> allowed.' } },
    {
      name: 'facts',
      type: 'array',
      labels: { singular: 'Fact', plural: 'Facts' },
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
    { name: 'indexHeading', type: 'text', admin: { description: 'Heading above the discipline index.' } },
    { name: 'footerHeadline', type: 'text', admin: { description: 'Footer CTA headline. <em>…</em> allowed.' } },
  ],
}
