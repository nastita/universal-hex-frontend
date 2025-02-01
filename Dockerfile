# Stage 1: Building the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .
COPY app ./app
COPY components ./components
COPY hooks ./hooks
COPY lib ./lib
COPY styles ./styles
COPY public ./public
COPY next.config.mjs ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./
COPY postcss.config.mjs ./

# Build the application
RUN npm run build

# Stage 2: Production environment
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
