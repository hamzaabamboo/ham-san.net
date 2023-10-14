FROM node:18-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1

WORKDIR /opt/app

COPY ./dist/apps/client .
COPY ./apps/client/scripts .
COPY ./apps/client/package.json .

RUN pnpm install --prod
ENV PUBLIC_API_URL=${PUBLIC_API_URL}
ENV PUBLIC_URL=${PUBLIC_URL}
ENV PRIVATE_OUTLINE_SERVER=${PRIVATE_OUTLINE_SERVER}
ENV PRIVATE_OUTLINE_API_TOKEN=${PRIVATE_OUTLINE_API_TOKEN}

EXPOSE 1337
CMD ["node --experimental-loader ./loader.js -r dotenv/config ./index.js"]
 