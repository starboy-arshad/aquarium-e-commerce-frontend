# Multi-stage build for React app

# First stage: build the app
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Second stage: serve with nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from first stage
COPY --from=build /app/build /usr/share/nginx/html

# Create nginx user for security
RUN adduser -D -s /bin/sh nginx

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chown -R nginx:nginx /var/cache/nginx
RUN chown -R nginx:nginx /var/log/nginx
RUN chown -R nginx:nginx /etc/nginx/conf.d
RUN chown -R nginx:nginx /etc/nginx/nginx.conf
RUN touch /var/run/nginx.pid
RUN chown -R nginx:nginx /var/run/nginx.pid

# Expose port 80
EXPOSE 80

# Start nginx as non-root user
CMD ["nginx", "-g", "daemon off;"]
