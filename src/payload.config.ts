import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Disciplines } from './collections/Disciplines'
import { Messages } from './collections/Messages'
import { SiteSettings } from './globals/SiteSettings'
import { HomeContent } from './globals/HomeContent'
import { contactEndpoint } from './endpoints/contact'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Email is only wired up when SMTP is configured; otherwise Payload logs to the
// console (so the contact form still works in development).
const emailAdapter = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromName: process.env.SMTP_FROM_NAME || 'Samuel Roland Vroom',
      defaultFromAddress: process.env.SMTP_FROM || 'portfolio@samuelrolandvroom.com',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
      },
    })
  : undefined

export default buildConfig({
  ...(emailAdapter ? { email: emailAdapter } : {}),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Samuel Roland Vroom',
    },
  },
  collections: [Disciplines, Media, Messages, Users],
  globals: [SiteSettings, HomeContent],
  endpoints: [contactEndpoint],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // push: true keeps the dev schema in sync without migrations.
    // Set to false (and use migrations) when pointing at production data.
    push: process.env.NODE_ENV !== 'production',
  }),
  sharp,
})
