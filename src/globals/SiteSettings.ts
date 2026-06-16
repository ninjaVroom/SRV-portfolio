import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'availability', type: 'text', admin: { description: 'Availability status shown in the top bar.' } },
    {
      type: 'row',
      fields: [
        { name: 'location', type: 'text', admin: { width: '50%' } },
        { name: 'locationFull', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'text', admin: { width: '50%' } },
        { name: 'phone', type: 'text', admin: { width: '25%' } },
        { name: 'phoneHref', type: 'text', admin: { width: '25%', description: 'tel: digits, e.g. +15482557484' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'linkedin', type: 'text', admin: { width: '50%' } },
        { name: 'linkedinLabel', type: 'text', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'domain', type: 'text', admin: { width: '50%' } },
        { name: 'copyright', type: 'text', admin: { width: '50%' } },
      ],
    },
    { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'SRV monogram (dark on light).' } },
    { name: 'logoWhite', type: 'upload', relationTo: 'media', admin: { description: 'SRV monogram (light on dark).' } },
    { name: 'resume', type: 'upload', relationTo: 'media', admin: { description: 'Résumé PDF used by download links.' } },
  ],
}
