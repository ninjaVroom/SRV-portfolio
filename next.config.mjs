import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output so the Docker production image stays small.
  output: 'standalone',
}

export default withPayload(nextConfig)
