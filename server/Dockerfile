FROM node:22-alpine

WORKDIR /usr/app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "start"]