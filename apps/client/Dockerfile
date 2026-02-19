FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm@9.12.3

# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1

WORKDIR /opt/app

COPY ./dist/apps/client .
COPY ./apps/client/scripts ./scripts
COPY ./apps/client/package.json .

RUN pnpm install --prod

EXPOSE 1337
CMD ["pnpm", "start:prod"]
 
