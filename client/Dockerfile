FROM node:16
WORKDIR /test-app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
ENV PORT 3000
EXPOSE 3000
EXPOSE 24678 
CMD npm run dev -- --host 