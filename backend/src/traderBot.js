import { request, gql } from 'graphql-request';
import BN from 'bn.js';
import Web3 from 'web3';
import Trade from './models/Trade';
import {
  TRADE_WAITING, TRADE_ERROR, TRADE_FULLFIED, TRADE_TRADING,
} from './TRADE_STATUS';
import smartContract from './smartContract';
import web3 from './web3';

const gplQuery = gql`
  {
    assetRates {
      id
      name
      rate
      isFrozen
    }
  }
`;

const fetchCurrentTokenPrices = () => request(process.env.TOKEN_PRICE_API, gplQuery)
  .catch(() => []);

export function exchangeToken(activeTrade, from) {
  return smartContract.methods.exchange(
    Web3.utils.toHex(activeTrade.sourceToken),
    Web3.utils.toHex(activeTrade.sourceAmount),
    Web3.utils.toHex(activeTrade.destToken),
  ).send({ from }).then((res) => {
    activeTrade.state = TRADE_FULLFIED;
    activeTrade.txHash = res.transactionHash;
    activeTrade.completeTime = Date.now();

    return activeTrade.save();
  }).catch((e) => {
    if (e.code === -32000 && activeTrade.tryCount < 10) {
      activeTrade.tryCount = activeTrade.tryCount + 1;
      activeTrade.save();

      return new Promise((resolve) => {
        setTimeout(resolve, 60000);
      }).then(() => exchangeToken(activeTrade, from));
    }

    activeTrade.state = TRADE_ERROR;
    activeTrade.completeTime = Date.now();
    activeTrade.errorMessage = JSON.stringify(e, null, 2);

    return activeTrade.save();
  });
}

export default async function traderBot() {
  try {
    const addresses = await web3.eth.getAccounts();
    const from = addresses[0];
    const currentTokenPrices = (await fetchCurrentTokenPrices()).assetRates;
    const activeTrades = await Trade.find({
      $or: [
        {
          expireAfter: {
            $exists: true,
            $gt: Date.now(),
          },
          state: TRADE_WAITING,
        },
        {
          expireAfter: {
            $exists: false,
          },
          state: TRADE_WAITING,
        },
      ],
    });

    const actions = [];

    for (const activeTrade of activeTrades) {
      for (const currentTokenPrice of currentTokenPrices) {
        if (activeTrade.conditionTarget === currentTokenPrice.name) {
          const currentPrice = new BN(currentTokenPrice.rate, 10);
          const dbPrice = new BN(activeTrade.conditionPrice, 10);

          if (activeTrade.conditionType === 'lte' && currentPrice.lte(dbPrice)) {
            activeTrade.state = TRADE_TRADING;
            actions.push(activeTrade.save());

            exchangeToken(activeTrade, from);
          } else if (activeTrade.conditionType === 'gte' && currentPrice.gte(dbPrice)) {
            activeTrade.state = TRADE_TRADING;
            actions.push(activeTrade.save());

            exchangeToken(activeTrade, from);
          }

          break;
        }
      }
    }

    Promise.allSettled(actions).then(() => {
      setTimeout(traderBot, 1000);
    });
  } catch (e) {
    console.error('error in trading', e);
    setTimeout(traderBot, 1000);
  }
}
