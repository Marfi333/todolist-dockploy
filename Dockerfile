FROM node:20-alpine AS builder
WORKDIR /app

COPY . .

ENV NODE_ENV=production

RUN npm install -g pnpm && \
  pnpm install --prod --frozen-lockfile && \
  pnpm run build

FROM node:20-alpine AS dokploy
WORKDIR /app

ENV NODE_ENV=production

RUN npm install -g pnpm

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
CMD ["pnpm", "start"]