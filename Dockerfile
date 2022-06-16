FROM node:latest

# Create app directory
WORKDIR /usr/src/cbg-discord-bot
COPY package*.json ./

RUN npm ci --only-production

COPY . .

EXPOSE 3030

RUN chmod -R 777 /usr/src/cbg-discord-bot

CMD ["npm", "start"]