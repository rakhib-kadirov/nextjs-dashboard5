FROM node:22
WORKDIR /app
COPY package*.json ./
COPY . .
RUN pnpm install
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]