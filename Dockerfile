# ---- Production image for the Next.js + Payload app (Docker self-host) ----
# Multi-stage build using Next.js standalone output.

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

# ---- deps ----
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

# ---- builder ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# PAYLOAD_SECRET/DATABASE_URI are not needed to build; provide a dummy secret.
ENV PAYLOAD_SECRET=build-time-placeholder
RUN pnpm build

# ---- runner ----
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN mkdir -p /app/media && chown -R nextjs:nodejs /app/media

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
