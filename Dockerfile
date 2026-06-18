FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY . .
ARG API_CMS=http://localhost:8000/api
ENV API_CMS=$API_CMS
RUN npm run generate

FROM nginx:alpine AS runner
COPY --from=builder /app/.output/public /usr/share/nginx/html
COPY spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
