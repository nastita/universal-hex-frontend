# Stage 1: Building the application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY app/ ./app/
COPY components/ ./components/
COPY docs/ ./docs/
COPY hooks/ ./hooks/
COPY lib/ ./lib/
COPY public/ ./public/
COPY styles/ ./styles/
COPY next.config.mjs ./
COPY postcss.config.mjs ./
COPY tailwind.config.ts ./
COPY tsconfig.json ./
COPY components.json ./

# Build the application
ARG NEXT_PUBLIC_HEX_API_URL
ENV NEXT_PUBLIC_HEX_API_URL=$NEXT_PUBLIC_HEX_API_URL
RUN npm run build

# Stage 2: Production environment
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ARG NEXT_PUBLIC_HEX_API_URL
ENV NEXT_PUBLIC_HEX_API_URL=$NEXT_PUBLIC_HEX_API_URL

# Copy necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
