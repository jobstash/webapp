FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN yarn global add pnpm && pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn global add pnpm
ENV NODE_ENV=production
# ENV NEXT_PUBLIC_MW_URL=https://middleware-prod-615438274260.europe-west4.run.app 
ENV NEXT_PUBLIC_MW_URL=https://middleware.dev.jobstash.xyz
ENV NEXT_PUBLIC_FRONTEND_URL=https://jobstash.xyz
ENV NEXT_PUBLIC_PAGE_SIZE=20
ENV NEXT_PUBLIC_VERI_URL=https://ecosystem.vision
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["sh", "-c", "HOSTNAME=\"0.0.0.0\" node server.js"]
