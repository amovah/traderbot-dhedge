# dHEDGE trader bot

to run this project, first you need to configure the app by editing `docker-compose.yml`:

in backend service you need to change these envs:

- `APP_AUTH_TOKEN`: the authorization token or we can way the password you wan to login into your bot dashboard
- `ETHER_PRIVATE_KEY`: your etherium private key
- `SMART_CONTRACT_ADDRESS`: your (smart contract) pool address
- `WEB3_PROVIDER`: infura link or any http provider like infura (I tested only infura).
- `TOKEN_PRICE_API`: api link which app is going fetch token prices from it.

in front service you need to change these envs:

- `REACT_APP_SMART_CONTRACT_ADDRESS`: your (smart contract) pool address
- `REACT_APP_WEB3_PROVIDER`: infura link or any http provider like infura (I tested only infura).
- `REACT_APP_ETHER_NETWORK`: enter which etheruem network are you working with, the app is using this as prefix for etherscan links.
- `REACT_APP_TOKEN_PRICE_API`: api link which app is going fetch token prices from it.

after you configured the app, then run below command:

```
docker-compose up --build -d
```

now you should be able to visit site on `http://localhost:8081`

to bring down the bot, run this command: `docker-compose down`
