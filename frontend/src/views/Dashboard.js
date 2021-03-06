import React, { useState, useEffect, useMemo } from "react";
import AppLayout from "src/components/AppLayout";
import {
  Row,
  Col,
  Spin,
  Statistic,
  Divider,
  message,
  Typography,
  List,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import getFund from "src/ether/getFund";
import getSynPrice from "src/api/getSynPrice";
import normalizeBigNumber from "src/normalizeBigNumber";
import BN from "bn.js";
import { useSelector } from "react-redux";
import getActiveTrades from "src/api/getActiveTrades";
import { ACTIVE_TRADE_ROUTE } from "src/routes";
import { NavLink } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import mdColors from "src/mdColors";

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function calculatePrice(a, b) {
  const first = new BN(a, 10);
  const second = new BN(b, 10);

  return normalizeBigNumber(first.mul(second).toString(), 36);
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [poolTokens, setPoolTokens] = useState([]);
  const [activeTrades, setActiveTrades] = useState([]);
  const [synPrice, setSynPrice] = useState([]);
  const [poolBalance, setPoolBalance] = useState(0);
  const userSystemToken = useSelector((state) => state.user.token);

  const colorSetTheme = useMemo(() => {
    return shuffle(mdColors);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const poolTokensRes = await getFund();
        const currentPricesRes = await getSynPrice();
        const activeTradesRes = await getActiveTrades(userSystemToken);

        setActiveTrades(activeTradesRes);
        setPoolTokens(poolTokensRes);
        setSynPrice(currentPricesRes.assetRates);

        let totalBalance = new BN("0", 10);

        setChartData(
          poolTokensRes
            .filter((item) => item.amount !== "0")
            .map((item) => {
              const current = currentPricesRes.assetRates.find(
                (price) => price.name === item.token
              );

              if (current) {
                const price = new BN(current.rate, 10);
                const amount = new BN(item.amount, 10);
                const totalPrice = price.mul(amount);

                totalBalance = totalBalance.add(totalPrice);

                const priceDollar = normalizeBigNumber(
                  totalPrice.toString(),
                  36
                );

                return {
                  data: priceDollar,
                  label: `${item.token} ${normalizeBigNumber(
                    amount.toString()
                  )}`,
                };
              }

              return {
                data: 0,
                label: `${item.token}`,
              };
            })
            .reduce(
              (acc, current) => {
                acc.datasets[0].data.push(current.data);
                acc.labels.push(current.label);

                return acc;
              },
              {
                datasets: [
                  {
                    data: [],
                    backgroundColor: colorSetTheme,
                  },
                ],
                labels: [],
              }
            )
        );

        setPoolBalance(normalizeBigNumber(totalBalance.toString(), 36));
        setLoading(false);
      } catch (e) {
        message.error("error when loading data - " + e);
      }
    }

    loadData();
  }, []);

  function generateDescription(item) {
    let coinTrades = new BN(0, 10);
    for (const activeTrade of activeTrades) {
      if (activeTrade.sourceToken === item.token) {
        coinTrades = coinTrades.add(new BN(activeTrade.sourceAmount, 10));
      }
    }

    return (
      <span>
        {normalizeBigNumber(item.amount)}/
        {calculatePrice(
          item.amount,
          synPrice.find((i) => i.name === item.token).rate
        )}
        $ {item.token}
        {coinTrades.toString() !== "0" && (
          <span>
            {" "}
            -- {normalizeBigNumber(coinTrades.toString())}/
            {calculatePrice(
              coinTrades.toString(),
              synPrice.find((i) => i.name === item.token).rate
            )}
            $ {item.token} of your total {item.token} tokens are in{" "}
            <NavLink to={ACTIVE_TRADE_ROUTE}>Active Trades</NavLink>
          </span>
        )}
      </span>
    );
  }

  if (loading) {
    return (
      <AppLayout>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Row>
        <Col span={11} offset={1}>
          <Doughnut data={chartData} />
        </Col>

        <Col span={11} offset={1}>
          <Row>
            <Col span={12}>
              <Statistic title="Pool Balance ($)" value={poolBalance} />
            </Col>
            <Col span={12}>
              <Statistic title="Active Trades" value={activeTrades.length} />
            </Col>
          </Row>
          <Divider />

          <Typography.Title level={5}>Your Tokens:</Typography.Title>

          <List
            dataSource={poolTokens}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.token}
                  description={generateDescription(item)}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </AppLayout>
  );
}
