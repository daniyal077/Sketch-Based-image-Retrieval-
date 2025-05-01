# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Replace backend URL
RUN sed -i 's|http://127.0.0.1:5000|/api|g' src/services/api.js

ENV NODE_ENV=production
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
