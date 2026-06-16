import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Disciplines } from './collections/Disciplines'
import { SiteSettings } from './globals/SiteSettings'
import { HomeContent } from './globals/HomeContent'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Samuel Roland Vroom',
    },
  },
  collections: [Disciplines, Media, Users],
  globals: [SiteSettings, HomeContent],
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
