/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import AppLayout from "src/components/AppLayout";
import {
  Form,
  InputNumber,
  Select,
  Button,
  Spin,
  Tooltip,
  message,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import getFund from "src/ether/getFund";
import getActiveTrades from "src/api/getActiveTrades";
import { useSelector } from "react-redux";
import BN from "bn.js";
import normalizeBigNumber from "src/normalizeBigNumber";
import getSynPrice from "src/api/getSynPrice";
import normalizeAmount from "src/normalizeAmount";
import convertToBigNumber from "src/convertToBigNumber";
import instantTradeApi from "src/api/instantTradeApi";
import { useHistory } from "react-router-dom";
import { ACTIVE_TRADE_ROUTE } from "src/routes";

export default function InstantExchange() {
  const [loading, setLoading] = useState(true);
  const [poolTokens, setPoolTokens] = useState([]);
  const [sourceTokens, setSourceTokens] = useState([]);
  const [destTokens, setDestTokens] = useState([]);
  const [synPrice, setSynPrice] = useState([]);
  const [userSourceToken, setUserSourceToken] = useState(null);
  const [userDestToken, setUserDestToken] = useState(null);
  const interval = useRef(null);
  const userSystemToken = useSelector((state) => state.user.token);
  const history = useHistory();

  function sendDataToServer(data) {
    instantTradeApi(userSystemToken, {
      ...data,
      sourceAmount: convertToBigNumber(data.amount).toString(),
    })
      .then(() => {
        message.success("Bot is exchanging your token");
        history.push(ACTIVE_TRADE_ROUTE);
      })
      .catch(() => {
        message.error("Could not create exchange");
      });
  }

  useEffect(() => {
    async function loadData() {
      const poolFunds = await getFund();
      const activeTrades = await getActiveTrades(userSystemToken);

      const result = [];
      for (const poolFund of poolFunds) {
        if (poolFund.amount === "0") {
          continue;
        }

        let coinTrades = new BN(0, 10);
        for (const activeTrade of activeTrades) {
          if (activeTrade.sourceToken === poolFund.token) {
            coinTrades = coinTrades.add(new BN(activeTrade.sourceAmount, 10));
          }
        }

        if (coinTrades.toString() !== "0") {
          const poolFundAmount = new BN(poolFund.amount, 10);
          result.push({
            token: poolFund.token,
            amount: normalizeBigNumber(
              poolFundAmount.sub(coinTrades).toString()
            ),
          });
        } else {
          result.push({
            token: poolFund.token,
            amount: normalizeBigNumber(poolFund.amount),
          });
        }
      }

      setPoolTokens(result);
      setSourceTokens(result);
      setDestTokens(result);
      setLoading(false);
    }

    loadData();
  }, []);

  function getAndSetSynPrice() {
    getSynPrice().then((res) => {
      setSynPrice(res.assetRates);
    });
  }

  useEffect(() => {
    getAndSetSynPrice();
    interval.current = setInterval(getAndSetSynPrice, 3000);

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Form
        name="create-trade"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        onFinish={sendDataToServer}
      >
        <Form.Item label="Source Token">
          <Form.Item name="sourceToken" noStyle rules={[{ required: true }]}>
            <Select
              onChange={(val) => {
                setDestTokens(poolTokens.filter((item) => item.token !== val));
                setUserSourceToken(val);
              }}
            >
              {sourceTokens.map((item) => {
                return (
                  <Select.Option value={item.token}>{item.token}</Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          {userSourceToken && (
            <span>
              {userSourceToken} current price:{" "}
              {normalizeBigNumber(
                synPrice.find((item) => item.name === userSourceToken)?.rate
              )}
              $
            </span>
          )}
        </Form.Item>
        <Form.Item label="Amount">
          <Form.Item name="amount" noStyle rules={[{ required: true }]}>
            <InputNumber
              width={200}
              min={0}
              max={
                sourceTokens.find((item) => item.token === userSourceToken)
                  ?.amount
              }
            />
          </Form.Item>
          {userSourceToken && (
            <span style={{ marginLeft: 18 }}>
              <Tooltip
                title={`you can only trade ${
                  sourceTokens.find((item) => item.token === userSourceToken)
                    ?.amount
                } of your total ${userSourceToken} tokens (if you have more in your pool, they are probably used in active trades. cancel them to unlock more token to trade)`}
              >
                <a>
                  max:{" "}
                  {
                    sourceTokens.find((item) => item.token === userSourceToken)
                      ?.amount
                  }{" "}
                  {userSourceToken} -{" "}
                  {normalizeAmount(
                    sourceTokens.find((item) => item.token === userSourceToken)
                      ?.amount *
                      normalizeBigNumber(
                        synPrice.find((item) => item.name === userSourceToken)
                          ?.rate
                      )
                  )}
                  $
                </a>
              </Tooltip>
            </span>
          )}
        </Form.Item>
        <Form.Item label="Destination Token">
          <Form.Item name="destToken" noStyle rules={[{ required: true }]}>
            <Select
              onChange={(val) => {
                setSourceTokens(
                  poolTokens.filter(
                    (item) => item.token !== val && item.amount !== 0
                  )
                );
                setUserDestToken(val);
              }}
            >
              {destTokens.map((item) => {
                return (
                  <Select.Option value={item.token}>{item.token}</Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          {userDestToken && (
            <span>
              {userDestToken} current price:{" "}
              {normalizeBigNumber(
                synPrice.find((item) => item.name === userDestToken)?.rate
              )}
              $ - you have{" "}
              {destTokens.find((item) => item.token === userDestToken)?.amount}{" "}
              {userDestToken}
            </span>
          )}
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
          <Button type="primary" htmlType="submit">
            Exchange
          </Button>
        </Form.Item>
      </Form>
    </AppLayout>
  );
}
