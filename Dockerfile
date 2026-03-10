FROM node:20-bookworm-slim AS base
WORKDIR /usr/src/app
RUN npm install -g bun@1.3.10
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ curl bash git && rm -rf /var/lib/apt/lists/*

FROM base AS install
COPY . /usr/src/app
RUN bun install --frozen-lockfile

FROM install AS build
RUN bunx nx run-many -p api,client -t build

FROM base AS api
WORKDIR /opt/app
COPY --from=build /usr/src/app/dist/apps/api ./
RUN bun install --production
EXPOSE 1337
CMD ["bun", "run", "start"]

FROM base AS client
WORKDIR /opt/app
COPY --from=build /usr/src/app/dist/apps/client ./
COPY --from=build /usr/src/app/apps/client/scripts ./scripts
COPY --from=build /usr/src/app/apps/client/package.json ./package.json
RUN bun install --production
EXPOSE 1337
CMD ["bun", "run", "start:prod"]
