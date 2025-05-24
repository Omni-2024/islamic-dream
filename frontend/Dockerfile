# Step 1: Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .

# Build the Next.js app
RUN npm run build

# Step 2: Runtime Stage
FROM node:22-alpine AS runtime

WORKDIR /app

# Copy necessary build output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./public/_next/static
COPY --from=builder /app/public ./public

RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "server.js"]
