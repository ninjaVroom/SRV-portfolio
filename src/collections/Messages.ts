import type { CollectionConfig } from 'payload'

/** Contact-form submissions (created via the /api/contact endpoint). */
export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Message', plural: 'Messages' },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'subject', 'createdAt'],
  },
  access: {
    // Submissions come through the /api/contact endpoint (overrideAccess);
    // the public cannot create/read messages directly.
    read: ({ req }) => Boolean(req.user),
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'email', type: 'email', required: true, admin: { width: '50%' } },
      ],
    },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'userAgent',
      type: 'text',
      admin: { readOnly: true, description: 'Submitter user agent (captured automatically).' },
    },
  ],
}
