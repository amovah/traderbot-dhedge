import { Router } from 'express';
import authMiddleware from 'src/authMiddleware';
import Trade from 'src/models/Trade';
import {
  TRADE_WAITING, TRADE_FULLFIED, TRADE_TRADING, TRADE_ERROR,
} from 'src/TRADE_STATUS';
import { exchangeToken } from 'src/traderBot';
import web3 from 'src/web3';

const router = Router();

router.post('/trade', authMiddleware, async (req, res) => {
  try {
    const trade = new Trade({
      sourceToken: req.body.sourceToken,
      destToken: req.body.destToken,
      sourceAmount: req.body.sourceAmount,
      conditionTarget: req.body.conditionTarget,
      conditionType: req.body.conditionType,
      conditionPrice: req.body.conditionPrice,
      expireAfter: req.body.expireAfter,
    });
    await trade.save();

    res.json(trade);
  } catch (e) {
    res.status(400).json({ status: 400, message: `bad request - ${e}` });
  }
});

router.post('/trade/instant', authMiddleware, async (req, res) => {
  try {
    const trade = new Trade({
      sourceToken: req.body.sourceToken,
      destToken: req.body.destToken,
      sourceAmount: req.body.sourceAmount,
      state: TRADE_TRADING,
    });
    await trade.save();

    const addresses = await web3.eth.getAccounts();
    const from = addresses[0];
    exchangeToken(trade, from);

    res.json(trade);
  } catch (e) {
    res.status(400).json({ status: 400, message: `bad request - ${e}` });
  }
});

router.get('/trade/active', authMiddleware, async (req, res) => {
  try {
    const trades = await Trade.find({
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
        {
          state: TRADE_TRADING,
        },
      ],
    }).sort({ createdAt: 'desc' });

    res.status(200).json(trades);
  } catch (e) {
    res.status(500).json({ status: 500, message: `internal server error - ${e}` });
  }
});

router.get('/trade/expired', authMiddleware, async (req, res) => {
  try {
    const trades = await Trade.find({
      expireAfter: { $lt: Date.now() },
      state: TRADE_WAITING,
    }).sort({ createdAt: 'desc' });

    res.status(200).json(trades);
  } catch (e) {
    res.status(500).json({ status: 500, message: `internal server error - ${e}` });
  }
});

router.get('/trade/fullfied', authMiddleware, async (req, res) => {
  try {
    const trades = await Trade.find({ state: TRADE_FULLFIED }).sort({ createdAt: 'desc' });

    res.status(200).json(trades);
  } catch (e) {
    res.status(500).json({ status: 500, message: `internal server error - ${e}` });
  }
});

router.get('/trade/failed', authMiddleware, async (req, res) => {
  try {
    const trades = await Trade.find({ state: TRADE_ERROR }).sort({ createdAt: 'desc' });

    res.status(200).json(trades);
  } catch (e) {
    res.status(500).json({ status: 500, message: `internal server error - ${e}` });
  }
});

router.delete('/trade/:tradeId', authMiddleware, async (req, res) => {
  try {
    await Trade.deleteOne({ _id: req.params.tradeId });
    res.status(200).json({ _id: req.params.tradeId });
  } catch (e) {
    res.status(400).json({ status: 400, message: `cannot cast to ObjectId - ${e}` });
  }
});

export default router;
