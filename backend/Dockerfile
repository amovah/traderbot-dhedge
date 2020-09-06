FROM node:12.18.3-alpine

WORKDIR /app

COPY . /app

RUN npm install

RUN npm run prod

CMD node .