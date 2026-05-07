FROM node:20-bookworm-slim AS base
WORKDIR /usr/src/app
RUN npm install -g bun@1.3.10
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ curl bash git && rm -rf /var/lib/apt/lists/*

FROM base AS install
COPY . /usr/src/app
RUN bun install --frozen-lockfile

FROM install AS build-api
RUN bunx nx run api:build

FROM install AS build-astro
ARG PUBLIC_API_URL
ARG PUBLIC_URL
ARG PUBLIC_OUTLINE_URL
ENV ASTRO_ADAPTER=node
ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV PUBLIC_URL=$PUBLIC_URL
ENV PUBLIC_OUTLINE_URL=$PUBLIC_OUTLINE_URL
WORKDIR /usr/src/app/apps/astro
RUN bun run codegen:prod && bun run build

FROM install AS build-legacy-client
RUN bunx nx run client:build

FROM build-api AS api
ENV PATH=/usr/src/app/apps/api/node_modules/.bin:/usr/src/app/node_modules/.bin:$PATH
WORKDIR /usr/src/app/dist/apps/api
RUN ln -s ../../../apps/api/node_modules ./node_modules
EXPOSE 1337
CMD ["bun", "run", "start"]

FROM build-astro AS astro
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
WORKDIR /usr/src/app/apps/astro
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]

FROM build-legacy-client AS legacy-client
ENV PATH=/usr/src/app/apps/client/node_modules/.bin:/usr/src/app/node_modules/.bin:$PATH
WORKDIR /usr/src/app/dist/apps/client
RUN ln -s ../../../apps/client/node_modules ./node_modules
EXPOSE 1337
CMD ["bun", "run", "start:prod"]

FROM legacy-client AS client
