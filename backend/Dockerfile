# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies (cache layer)
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 2: Runner
FROM node:18-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# CREATE USER (Security)
# Create a group and user to run our app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy only necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Start command (with migration check if needed, but best separate)
CMD ["npm", "start"]
