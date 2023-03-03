FROM node:18-alpine

# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache curl build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev

# Install pnpm
RUN curl -f https://get.pnpm.io/v6.16.js | npm install -g pnpm

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/app
COPY pnpm-lock.yaml ./
ENV PATH /node_modules/.bin:$PATH
RUN pnpm fetch --prod

COPY package.json .
RUN pnpm install --offline --prod --shamefully-hoist --config.auto-install-peers=true --strict-peer-dependencies

COPY ./ .
RUN pnpm build

# Remove this step since we're on vm
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
 