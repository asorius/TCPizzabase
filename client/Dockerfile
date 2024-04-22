FROM node:20.10.0-alpine3.18 AS builder

WORKDIR /app

COPY ../package*.json .
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm ci

COPY . .


ARG VITE_API_ORIGIN
ARG VITE_API_PATH

WORKDIR /app/client

RUN npm run build

# # Stage 2: Serve the application with Nginx
FROM nginx:1.25.3-alpine3.18

# # Delete the default welcome page.
RUN rm /usr/share/nginx/html/* -rf

# # Copy the built client app assets to the Nginx directory
COPY --from=builder /app/client/dist /usr/share/nginx/html


# # Copy the Nginx configuration
COPY client/nginx/default.conf.template /etc/nginx/templates/default.conf.template

# # Expose port 80 to the outside
EXPOSE 3000

# # Start Nginx.
CMD ["nginx", "-g", "daemon off;"]

