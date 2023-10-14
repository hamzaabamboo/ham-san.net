FROM node:18-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache curl build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev


COPY package.json ./
# COPY patches ./patches
RUN pnpm install -r --prod

COPY ./ .

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

EXPOSE 1337
CMD ["pnpm", "nx", "start", "api"]