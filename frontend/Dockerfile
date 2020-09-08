FROM node:12.18.3-alpine

WORKDIR /app

COPY . /app

RUN yarn install

RUN yarn global add serve

RUN yarn run build

CMD serve -s build