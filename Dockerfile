FROM node:22-alpine AS base

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
ENV NEXT_PUBLIC_MW_URL=https://middleware.jobstash.xyz
ENV NEXT_PUBLIC_FRONTEND_URL=https://v2.jobstash.xyz
ENV NEXT_PUBLIC_PAGE_SIZE=20
ENV NEXT_PUBLIC_VERI_URL=https://ecosystem.vision
ENV NEXT_PUBLIC_PRIVY_APP_ID=clyr78r8l05a16wqnojin5hbz
ENV NEXT_PUBLIC_PRIVY_CLIENT_ID=client-WY2o8bjWEos9v51Y8kW3NYA9JG5qTVPZSbQSQZePpPRBq
ENV NEXT_PUBLIC_JOB_FRAME_URL=https://job-frame.vercel.app
ENV NEXT_PUBLIC_INFURA_ID=805a91964ce748f7b7b3d0c787ad7783
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
EXPOSE 3000
ENV PORT=3000
USER nextjs
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
