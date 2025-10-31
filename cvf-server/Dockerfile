# Stage 1: Build
FROM node:20 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS (nếu fail thì container sẽ stop)
RUN npm run build

# Stage 2: Production
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install 
# Ensure native optional dependency present for css-inline on linux-x64
RUN npm install @css-inline/css-inline-linux-x64-gnu@latest --no-save

# Copy dist từ builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

# Copy templates from builder
COPY --from=builder /usr/src/app/src/mail/templates ./src/mail/templates

# Copy entrypoint script
COPY --from=builder /usr/src/app/entrypoint.sh ./entrypoint.sh

# Generate Prisma Client for production
RUN npx prisma generate

EXPOSE 8000

# Ensure Unix line-endings and executable bit for entrypoint
RUN sed -i 's/\r$//' ./entrypoint.sh && chmod +x ./entrypoint.sh
CMD ["sh", "./entrypoint.sh"]