FROM node:latest

# Create app directory
USER cbg-discord-bot
RUN chown -R cbg-discord-bot /usr/src/cbg-discord-bot

WORKDIR /usr/src/cbg-discord-bot
COPY package*.json ./

RUN npm ci --only-production

COPY . .

EXPOSE 3030

CMD ["npm", "start"]