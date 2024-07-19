#TODO: Better Dockerfile
FROM node:18-alpine3.18 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev curl nasm bash git > /dev/null 2>&1
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run -r build
RUN pnpm deploy --filter=api --prod /prod/api
RUN pnpm deploy --filter=client --prod /prod/client

FROM base AS api
COPY --from=build /prod/app1 /prod/app1
WORKDIR /prod/app1
EXPOSE 1337
CMD [ "pnpm", "start" ]

FROM base AS client
COPY --from=build /prod/app2 /prod/app2
WORKDIR /prod/app2
EXPOSE 1337
CMD [ "pnpm", "start" ]