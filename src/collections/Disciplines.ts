import type { CollectionConfig } from 'payload'

export const Disciplines: CollectionConfig = {
  slug: 'disciplines',
  labels: { singular: 'Discipline', plural: 'Disciplines' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['number', 'title', 'slug', 'featured'],
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    // ----- Identity & home-index row -----
    {
      type: 'row',
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
          admin: { width: '20%', description: 'Two-digit index, e.g. 01' },
        },
        {
          name: 'order',
          type: 'number',
          required: true,
          admin: { width: '20%', description: 'Sort + prev/next order (1–7)' },
        },
        {
          name: 'accent',
          type: 'select',
          required: true,
          admin: { width: '60%' },
          options: [
            { label: 'PM — green', value: 'pm' },
            { label: 'Web — blue', value: 'web' },
            { label: 'Mobile — teal', value: 'mobile' },
            { label: 'Design — magenta', value: 'design' },
            { label: 'Video — amber', value: 'video' },
            { label: 'Writing — violet', value: 'write' },
            { label: 'Screen — red', value: 'screen' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: { width: '50%', description: 'URL path, e.g. project-management' },
        },
      ],
    },
    {
      name: 'titleLines',
      type: 'array',
      labels: { singular: 'Title line', plural: 'Title lines' },
      admin: { description: 'Hero headline split across lines (the <br> breaks in the design).' },
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'indexRole',
          type: 'text',
          required: true,
          admin: { width: '50%', description: 'Home index row — role line' },
        },
        {
          name: 'indexTools',
          type: 'text',
          required: true,
          admin: { width: '50%', description: 'Home index row — tools line' },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: { description: 'Shows the “Primary focus” badge on the home index.' },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      admin: { description: 'SEO meta description for this discipline page.' },
    },

    // ----- Hero -----
    {
      name: 'tag',
      type: 'text',
      required: true,
      admin: { description: 'Italic hero tagline (serif).' },
    },
    {
      name: 'intro',
      type: 'textarea',
      required: true,
      admin: { description: 'Hero intro paragraph. <strong>…</strong> allowed for emphasis.' },
    },

    // ----- Capabilities -----
    { name: 'capabilitiesHeading', type: 'text', defaultValue: 'Capabilities' },
    {
      name: 'capabilities',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Capability', plural: 'Capabilities' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },

    // ----- Selected work -----
    { name: 'workHeading', type: 'text', required: true },
    {
      name: 'projects',
      type: 'array',
      labels: { singular: 'Project', plural: 'Projects' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'year', type: 'text' },
        { name: 'role', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'placeholderTag',
          type: 'text',
          admin: { description: 'Caption on the striped placeholder until an image is added.' },
        },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'link', type: 'text', admin: { description: 'Optional external / case-study link.' } },
      ],
    },

    // ----- Proof banner -----
    {
      type: 'collapsible',
      label: 'Proof banner',
      admin: { initCollapsed: false },
      fields: [
        { name: 'proofBig', type: 'text', admin: { description: 'Big stat/word in the accent banner.' } },
        { name: 'proofLabel', type: 'text' },
        { name: 'proofDescription', type: 'textarea', admin: { description: '<em>…</em> allowed.' } },
      ],
    },

    // ----- Tools -----
    { name: 'toolsHeading', type: 'text', defaultValue: 'Tools of the trade' },
    {
      name: 'tools',
      type: 'array',
      labels: { singular: 'Tool', plural: 'Tools' },
      fields: [{ name: 'name', type: 'text', required: true }],
    },

    // ----- Footer -----
    {
      name: 'footerHeadline',
      type: 'text',
      required: true,
      admin: { description: 'Footer CTA headline. <em>…</em> allowed.' },
    },
  ],
}
