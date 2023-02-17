# path: ./Dockerfile.prod

FROM node:18-alpine as build

RUN apk update && apk add --no-cache curl
# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1

# Install pnpm
RUN curl -f https://get.pnpm.io/v6.16.js | npm install -g pnpm

WORKDIR /opt/
COPY pnpm-lock.yaml ./
ENV PATH /node_modules/.bin:$PATH
RUN pnpm fetch 

WORKDIR /opt/app
COPY ./ .
RUN pnpm install --offline --shamefully-hoist --config.auto-install-peers=true --strict-peer-dependencies

RUN pnpm build:prod

ARG PUBLIC_API_URL=${PUBLIC_API_URL}
ENV PUBLIC_API_URL=${PUBLIC_API_URL}

# Remove additional layer since we're on vm
# FROM node:18-alpine
# RUN apk update && apk add --no-cache curl
# # Install pnpm
# RUN curl -f https://get.pnpm.io/v6.16.js | npm install -g pnpm
# RUN apk add --no-cache vips-dev
# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}
# WORKDIR /opt/app
# COPY --from=build /opt/node_modules ./node_modules
# ENV PATH /opt/node_modules/.bin:$PATH
# COPY --from=build /opt/app ./

EXPOSE 1337
CMD ["pnpm", "start"]
 