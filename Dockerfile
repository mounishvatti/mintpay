# Step 1: Use Node.js image for building
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lock files to install dependencies
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Install dependencies without unnecessary files
RUN npm install --frozen-lockfile

# Copy the entire project
COPY . .

# Build the Next.js app
RUN npm run build

# Step 2: Use a minimal image for the final container
FROM node:22-alpine AS runner

# Set working directory
WORKDIR /app

# Copy only the built files from the previous step
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]