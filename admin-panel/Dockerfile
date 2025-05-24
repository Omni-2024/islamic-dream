# Step 1: Set the base image for building
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Build the Next.js app
RUN npm run build

# Step 2: Set the runtime image
FROM node:22-alpine AS runtime

WORKDIR /app

# Copy only the necessary build files from the builder stage
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/package.json /app/package-lock.json /app/

# Install only the production dependencies
RUN npm install  --legacy-peer-deps

# Expose the default Next.js port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
