FROM node:16-slim AS prebuild
WORKDIR /app

# Copy package metadata
COPY package.json yarn.lock ./

# Copy all the submodules
COPY frontend frontend
COPY packages packages

# Remove every file in submodules except package metadata
RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf
RUN find frontend \! -name "package.json" -mindepth 1 -maxdepth 1 -print | xargs rm -rf


FROM node:16-slim AS builder
WORKDIR /app

# Copy all the package metadata from prebuild stage
# This stage is time consuming. So its made sure it runs only when necessary
COPY --from=prebuild /app ./

# Install deps
RUN yarn install --frozen-lockfile

# Copy the source code
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# build the image
RUN yarn build


# Production image, copy all the files and run the server
FROM node:16-slim AS runner

# link the docker image to animeflix repo
LABEL org.opencontainers.image.source https://github.com/chirag-droid/animeflix

WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the build files from the builder stage
COPY --from=builder --chown=nextjs:nodejs /app/frontend/next.config.js ./frontend/
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./frontend/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/frontend/public ./frontend/public

# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./

USER nextjs

# Expose port 3000
EXPOSE 3000

ENV PORT 3000

# Run the server
CMD ["node", "frontend/server.js"]
