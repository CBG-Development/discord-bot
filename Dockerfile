FROM node:latest

# Create app directory
WORKDIR /usr/src/cbg-discord-bot
COPY package*.json ./
COPY reactionrole.json ./
COPY tournaments.json ./
COPY vCodes.json ./

RUN npm config set unsafe-perm true
RUN npm ci --only-production

COPY . .

EXPOSE 3030

CMD ["npm", "start"]