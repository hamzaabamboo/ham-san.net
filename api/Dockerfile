FROM node:18-alpine

# Install yarn
# RUN corepack enable && corepack prepare yarn@latest --activate

# Installing libvips-dev for sharp Compatibility
RUN apk update && apk add --no-cache curl build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev make g++ python3

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/app


RUN export PATH="$(yarn global bin):$PATH"

RUN yarn global add node-gyp
# COPY package.json pnpm-lock.yaml .npmrc ./
COPY package.json yarn.lock ./
# COPY patches ./patches
# RUN echo "Y" | pnpm install --shamefully-hoist --config.auto-install-peers=true --strict-peer-dependencies
RUN yarn install

COPY ./ .
ENV PUBLIC_API_URL=${PUBLIC_API_URL}
RUN yarn build

# RUN pnpm prune --prod
RUN yarn install --prod

# Remove this step since we're on vm
# FROM node:18-alpine
# RUN apk update && apk add --no-cache curl
# # Install yarn
# RUN curl -f https://get.yarn.io/v6.16.js | npm install -g yarn
# RUN apk add --no-cache vips-dev
# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}
# WORKDIR /opt/app
# COPY --from=build /opt/node_modules ./node_modules
# ENV PATH /opt/node_modules/.bin:$PATH
# COPY --from=build /opt/app ./

EXPOSE 1337
CMD ["yarn", "start"]
 