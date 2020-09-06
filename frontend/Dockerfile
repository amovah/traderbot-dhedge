FROM node:12.18.3-alpine

RUN apk add bash

WORKDIR /app

COPY . /app

RUN yarn install

RUN yarn global add serve

RUN yarn run build

RUN touch .env

CMD chmod +x ./env.sh && bash env.sh && serve -s build