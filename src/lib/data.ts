import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

/** A single Payload instance per request (deduped with React cache). */
export const getPayloadClient = cache(async () => getPayload({ config }))

export const getSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getHome = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'home', depth: 1 })
})

export const getDisciplines = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'disciplines',
    sort: 'order',
    limit: 100,
    depth: 1,
  })
  return docs
})

export const getDiscipline = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'disciplines',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})
