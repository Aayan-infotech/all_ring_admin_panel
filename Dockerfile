FROM node:20 AS build

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./
# Use npm ci (faster and reproducible) and allow legacy peer deps to avoid ERESOLVE
RUN npm ci --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Build the Vite application
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the build output to Nginx's public folder
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port that container serves (map to host in docker run)
EXPOSE 2005

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
