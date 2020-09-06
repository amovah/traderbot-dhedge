# dHEDGE trader bot

to run this project, first you need to configure the app by editing `docker-compose.yml`:

in backend service you need to change these envs:

- `APP_AUTH_TOKEN`: the authorization token or the password you want to login into your bot dashboard
- `ETHER_PRIVATE_KEY`: your etherium private key - must be manager private key
- `SMART_CONTRACT_ADDRESS`: your (smart contract) pool address - must be same with frontend service
- `WEB3_PROVIDER`: infura link or any http web3 provider like infura (I tested only infura).
- `TOKEN_PRICE_API`:dhedge graphql api which provide token rates based on dollar.

in front service you need to change these envs:

- `REACT_APP_SMART_CONTRACT_ADDRESS`: your (smart contract) pool address - must be same with backend service
- `REACT_APP_WEB3_PROVIDER`: infura link or any http web3 provider like infura (I tested only infura).
- `REACT_APP_ETHER_NETWORK`: enter which etheruem network are you working with, the app is using this as prefix for etherscan links.
- `REACT_APP_TOKEN_PRICE_API`: dhedge graphql api which provide token rates based on dollar.

after you configured the app, then run below command:

```
docker-compose up --build -d
```

now you should be able to visit site on `http://localhost:8081`

to bring down the bot, run this command: `docker-compose down`
