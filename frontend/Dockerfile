# Stage 1 — Build the React bundle
FROM node:20-alpine AS builder
WORKDIR /app

ARG API_URL=https://monProjet.region.run.app
ENV VITE_API_URL=$API_URL

COPY package*.json ./
RUN npm ci

COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./
COPY public ./public
COPY src ./src

RUN npm run build

# Stage 2 — Serve static assets with Nginx
FROM nginx:1.27-alpine

ENV PORT=8080
EXPOSE 8080

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
