# FROM playwright-base:latest
# COPY --chown=node:node ./package*.json .
# RUN npm ci
# COPY --chown=node:node . .
# ENTRYPOINT ["npx", "playwright", "test"]
# CMD []

FROM mcr.microsoft.com/playwright:v1.58.2-noble

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npx", "playwright", "test"]