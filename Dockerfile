FROM node:18-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./

RUN npm i pnpm -g
RUN pnpm i

COPY . /app

RUN pnpm build

CMD ["pnpm", "start"]