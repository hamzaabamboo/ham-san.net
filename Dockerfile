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
RUN bun run build

FROM install AS build-legacy-client
RUN bunx nx run client:build

FROM base AS api
WORKDIR /opt/app
COPY --from=build-api /usr/src/app/dist/apps/api ./
RUN bun install --production --ignore-scripts
EXPOSE 1337
CMD ["bun", "run", "start"]

FROM base AS astro
WORKDIR /opt/app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
COPY --from=build-astro /usr/src/app/apps/astro ./
RUN bun install --production --ignore-scripts
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]

FROM base AS legacy-client
WORKDIR /opt/app
COPY --from=build-legacy-client /usr/src/app/dist/apps/client ./
COPY --from=build-legacy-client /usr/src/app/apps/client/scripts ./scripts
COPY --from=build-legacy-client /usr/src/app/apps/client/package.json ./package.json
RUN bun install --production --ignore-scripts
EXPOSE 1337
CMD ["bun", "run", "start:prod"]

FROM legacy-client AS client
