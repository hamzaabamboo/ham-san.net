# Deprecated: the active API container is built from the root Dockerfile target `api`.
# Keep this file temporarily for rollback only; do not wire new compose or Nx targets to it.

FROM node:20-bookworm-slim

RUN npm install -g bun@1.3.10
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ curl bash && rm -rf /var/lib/apt/lists/*

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/app

COPY package.json ./
RUN bun install

COPY ./ .
RUN bun run build

EXPOSE 1337
CMD ["bun", "run", "start"]
