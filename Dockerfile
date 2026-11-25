FROM node:16-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM deps AS build
COPY . .
RUN npx ng build

FROM deps AS test
RUN apk add --no-cache chromium
ENV CHROME_BIN=/usr/bin/chromium-browser
COPY . .
CMD ["npx", "ng", "test", "--watch=false", "--browsers=ChromeHeadlessCI"]

FROM nginx:1.27-alpine
ENV API_UPSTREAM=http://host.docker.internal:8080
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/expense-tracker-frontend /usr/share/nginx/html
EXPOSE 80
