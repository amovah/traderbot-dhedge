FROM node:12.18.3-alpine

WORKDIR /app

COPY . /app

RUN yarn install

RUN yarn global add serve

ENV REACT_APP_API_SERVER="http://localhost:8080"
ENV REACT_APP_SMART_CONTRACT_ADDRESS="0xefc586336650505541217e08a30e422cd84688a9"
ENV REACT_APP_WEB3_PROVIDER="https://ropsten.infura.io/v3/f866790911da4bec9591888aa9a88348"
ENV REACT_APP_ETHER_NETWORK="ropsten"
ENV REACT_APP_TOKEN_PRICE_API="https://api.dhedge.org/graphql"

RUN yarn run build

CMD serve -s build