FROM node:latest as base

# Create app directory
WORKDIR /usr/src/cbg-discord-bot
COPY package*.json ./
EXPOSE 3030

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . /
CMD ["node", "src/index.js"]
