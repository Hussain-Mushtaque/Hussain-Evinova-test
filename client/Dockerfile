FROM node:22-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN rm -rf node_modules package-lock.json
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]