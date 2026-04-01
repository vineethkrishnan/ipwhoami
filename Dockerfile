FROM node:22-alpine AS base

LABEL maintainer="Vineeth Krishnan"
LABEL org.opencontainers.image.source="https://github.com/vineethkrishnan/ipwhoami"
LABEL org.opencontainers.image.description="IP geolocation lookup from your terminal"
LABEL org.opencontainers.image.licenses="MIT"

WORKDIR /app

COPY package.json ./
COPY bin/ ./bin/
COPY src/ ./src/

RUN chmod +x bin/ipwhoami.js

ENTRYPOINT ["node", "bin/ipwhoami.js"]
