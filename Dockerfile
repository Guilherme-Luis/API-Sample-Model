FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY src ./src
COPY uploads ./uploads

ENV NODE_ENV=production
ENV PORT=5000
ENV API_VERSION=1.1.0

EXPOSE 5000

CMD ["npm", "start"]
