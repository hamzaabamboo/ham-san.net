FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm@9.12.3

# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache curl build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/app

COPY package.json ./
# COPY patches ./patches
RUN pnpm install --prod

COPY ./ .

EXPOSE 1337
CMD ["pnpm", "start"]
