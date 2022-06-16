FROM node:latest

# Create app directory
WORKDIR /usr/src/cbg-discord-bot
COPY package*.json ./

RUN npm ci --only-production

COPY . .

EXPOSE 3030

USER cbgdiscordbot

CMD ["npm", "start"]