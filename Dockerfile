FROM node:latest

# Create app directory
WORKDIR /usr/src/cbg-discord-bot
COPY package*.json ./

RUN npm ci --only-production

COPY . .

EXPOSE 3030

RUN chown -R cbg-discord-bot /usr/src/cbg-discord-bot
USER cbg-discord-bot

CMD ["npm", "start"]