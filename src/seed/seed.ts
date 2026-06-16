import { getPayload } from 'payload'
import config from '@payload-config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ── ESM dirname / paths ──────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ASSETS_DIR = path.resolve(__dirname, 'assets')
const CONTENT_PATH = path.resolve(__dirname, 'content.json')

// ── Content shape (loose — we only read it) ──────────────────────────
type Fact = { value: string; label: string }
type Capability = { title: string; description: string }
type Project = {
  title: string
  year?: string
  role?: string
  description?: string
  placeholderTag?: string
}
type Proof = { big: string; label: string; description: string }
type Accent = 'pm' | 'web' | 'mobile' | 'design' | 'video' | 'write' | 'screen'
type Discipline = {
  number: string
  slug: string
  title: string
  titleLines: string[]
  accent: Accent
  indexRole: string
  indexTools: string
  featured: boolean
  metaDescription: string
  tag: string
  intro: string
  capabilitiesHeading: string
  capabilities: Capability[]
  workHeading: string
  projects: Project[]
  proof: Proof
  toolsHeading: string
  tools: string[]
  footerHeadline: string
}
type Content = {
  site: Record<string, string>
  home: {
    title: string
    metaDescription: string
    ogTitle: string
    ogDescription: string
    eyebrow: string[]
    nameLines: string[]
    lede: string
    facts: Fact[]
    indexHeading: string
    footerHeadline: string
  }
  disciplines: Discipline[]
}

const content: Content = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf-8'))

// ── Helpers ──────────────────────────────────────────────────────────
const log = (...args: unknown[]) => console.log('  •', ...args)

/**
 * Find a media doc by its stored filename; create it from disk if absent.
 * Idempotent — returns the existing/created doc id.
 */
async function upsertMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  fileName: string,
  alt: string,
): Promise<number> {
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: fileName } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length > 0) {
    log(`media exists: ${fileName} (id ${existing.docs[0].id})`)
    return existing.docs[0].id
  }
  const filePath = path.resolve(ASSETS_DIR, fileName)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Asset not found on disk: ${filePath}`)
  }
  const created = await payload.create({
    collection: 'media',
    filePath,
    data: { alt },
  })
  log(`media created: ${fileName} (id ${created.id})`)
  return created.id
}

// ── Main ─────────────────────────────────────────────────────────────
async function seed() {
  const payload = await getPayload({ config })

  console.log('\n── Seeding SRV portfolio ───────────────────────────────')

  // 1) Admin user (only if none exist) ─────────────────────────────────
  console.log('\n[1] Admin user')
  const users = await payload.find({ collection: 'users', limit: 1, depth: 0 })
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@samuelrolandvroom.com'
  if (users.totalDocs === 0) {
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!'
    await payload.create({
      collection: 'users',
      data: { email: adminEmail, password: adminPassword },
    })
    log(`admin created: ${adminEmail}`)
  } else {
    log(`admin already exists — skipping (login: ${adminEmail})`)
  }

  // 2) Media (logo, logoWhite, resume) ─────────────────────────────────
  console.log('\n[2] Media')
  const logoId = await upsertMedia(payload, 'logo.png', 'SRV monogram — Samuel Roland Vroom')
  const logoWhiteId = await upsertMedia(payload, 'logo-white.png', 'SRV monogram (reversed)')
  const resumeId = await upsertMedia(payload, 'Samuel-Vroom-Resume.pdf', 'Samuel Vroom résumé (PDF)')

  // 3) Site settings global ────────────────────────────────────────────
  console.log('\n[3] Site settings')
  const s = content.site
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      name: s.name,
      availability: s.availability,
      location: s.location,
      locationFull: s.locationFull,
      email: s.email,
      phone: s.phone,
      phoneHref: s.phoneHref,
      linkedin: s.linkedin,
      linkedinLabel: s.linkedinLabel,
      domain: s.domain,
      copyright: s.copyright,
      logo: logoId,
      logoWhite: logoWhiteId,
      resume: resumeId,
    },
  })
  log('site-settings updated')

  // 4) Home global ─────────────────────────────────────────────────────
  console.log('\n[4] Home')
  const h = content.home
  await payload.updateGlobal({
    slug: 'home',
    data: {
      title: h.title,
      metaDescription: h.metaDescription,
      ogTitle: h.ogTitle,
      ogDescription: h.ogDescription,
      eyebrow: h.eyebrow.map((text) => ({ text })),
      nameLines: h.nameLines.map((text) => ({ text })),
      lede: h.lede,
      facts: h.facts.map((f) => ({ value: f.value, label: f.label })),
      indexHeading: h.indexHeading,
      footerHeadline: h.footerHeadline,
    },
  })
  log('home updated')

  // 5) Disciplines (upsert by slug) ────────────────────────────────────
  console.log('\n[5] Disciplines')
  for (const d of content.disciplines) {
    const data = {
      number: d.number,
      order: parseInt(d.number, 10), // "01" → 1
      accent: d.accent,
      title: d.title,
      slug: d.slug,
      titleLines: d.titleLines.map((text) => ({ text })),
      indexRole: d.indexRole,
      indexTools: d.indexTools,
      featured: d.featured,
      metaDescription: d.metaDescription,
      tag: d.tag,
      intro: d.intro,
      capabilitiesHeading: d.capabilitiesHeading,
      capabilities: d.capabilities.map((c) => ({
        title: c.title,
        description: c.description,
      })),
      workHeading: d.workHeading,
      projects: d.projects.map((p) => ({
        title: p.title,
        year: p.year,
        role: p.role,
        description: p.description,
        placeholderTag: p.placeholderTag,
      })),
      proofBig: d.proof.big,
      proofLabel: d.proof.label,
      proofDescription: d.proof.description,
      toolsHeading: d.toolsHeading,
      tools: d.tools.map((name) => ({ name })),
      footerHeadline: d.footerHeadline,
    }

    const existing = await payload.find({
      collection: 'disciplines',
      where: { slug: { equals: d.slug } },
      limit: 1,
      depth: 0,
    })

    if (existing.docs.length > 0) {
      await payload.update({
        collection: 'disciplines',
        id: existing.docs[0].id,
        data,
      })
      log(`updated: ${d.number} ${d.title} (${d.slug})`)
    } else {
      await payload.create({ collection: 'disciplines', data })
      log(`created: ${d.number} ${d.title} (${d.slug})`)
    }
  }

  console.log('\n✓ Seed complete.\n')
}

// Top-level await so `payload run` waits for the async work before exiting.
try {
  await seed()
  process.exit(0)
} catch (err) {
  console.error('\n✗ Seed failed:\n', err)
  process.exit(1)
}
