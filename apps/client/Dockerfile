FROM node:20-alpine

RUN npm install -g bun@1.3.10
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev > /dev/null 2>&1

WORKDIR /opt/app

COPY ./dist/apps/client .
COPY ./apps/client/scripts ./scripts
COPY ./apps/client/package.json .

RUN bun install --production

EXPOSE 1337
CMD ["bun", "run", "start:prod"]
 
