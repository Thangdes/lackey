FROM node:22-slim AS builder
LABEL author="mrtaivietbac@gmail.com"
 
WORKDIR /app
 

COPY package*.json ./
COPY next.config.ts ./
RUN npm ci
 

COPY . .
 

ENV NODE_ENV=production
RUN npm run build 

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

RUN useradd -m nextjs
 

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Ensure runtime cache directory exists and is writable by non-root user
RUN mkdir -p /app/.next/cache && \
    chown -R nextjs:nextjs /app

EXPOSE 3000
 
 
USER nextjs
CMD ["node", "server.js"]
