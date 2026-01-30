# Stage 1: Install dependencies
FROM node:22-alpine AS deps
WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Stage 2: Build application
FROM node:22-alpine AS builder
WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Build-time environment variables (Coolify passes these as --build-arg)
ARG NEXT_PUBLIC_MW_URL
ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_PRIVY_APP_ID
ENV NEXT_PUBLIC_MW_URL=$NEXT_PUBLIC_MW_URL
ENV NEXT_PUBLIC_FRONTEND_URL=$NEXT_PUBLIC_FRONTEND_URL
ENV NEXT_PUBLIC_PRIVY_APP_ID=$NEXT_PUBLIC_PRIVY_APP_ID

# Server env stubs — only needed to pass Zod validation during build
# Real secrets injected at runtime by Coolify
ENV SESSION_SECRET="build-time-placeholder-not-used-at-runtime-"
ENV PRIVY_APP_SECRET="build-time-placeholder"

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js
RUN pnpm build

# Stage 3: Production runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
