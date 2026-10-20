# Practical 11: Standard Node.js Backend Containerization Dockerfile
# Base image: Official Node.js 18 LTS on lightweight Alpine Linux
FROM node:18-alpine

# Set application working directory inside container
WORKDIR /app

# Set production environment flags
ENV NODE_ENV=production
ENV PORT=5000

# Copy package manifests first to leverage Docker layer caching for dependencies
COPY package*.json ./

# Install production dependencies inside the container
RUN npm install --omit=dev

# Copy application backend source code and config
COPY . .

# Expose backend REST API port
EXPOSE 5000

# Start Express & MongoDB REST API server
CMD ["node", "server.js"]
