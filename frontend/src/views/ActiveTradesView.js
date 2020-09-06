/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import AppLayout from "src/components/AppLayout";
import { Spin, message, Table, Tooltip, Button, Popconfirm } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import normalizeBigNumber from "src/normalizeBigNumber";
import getActiveTrades from "src/api/getActiveTrades";
import moment from "moment";
import deleteActiveTradeApi from "src/api/deleteActiveTradeApi";

const columns = (userSystemToken) => [
  {
    title: "Source Token",
    dataIndex: "sourceToken",
    key: "sourceToken",
  },
  {
    title: "Destination Token",
    dataIndex: "destToken",
    key: "destToken",
  },
  {
    title: "Traded Token Amount",
    dataIndex: "sourceAmount",
    key: "sourceAmount",
    render: (text, record) =>
      `${normalizeBigNumber(text)} ${record.sourceToken}`,
  },
  {
    title: "Trade Condition Token",
    dataIndex: "conditionTarget",
    key: "conditionTarget",
    render: (text) => {
      if (!text) {
        return "-";
      }

      return text;
    },
  },
  {
    title: "Trade Condition Type",
    dataIndex: "conditionType",
    key: "conditionType",
    render: (text, record) => {
      if (!text) {
        return "-";
      }

      if (text === "lte") {
        return (
          <Tooltip
            title={`If ${
              record.conditionTarget
            } price is less than ${normalizeBigNumber(
              record.conditionPrice
            )} $`}
          >
            LTE
          </Tooltip>
        );
      }

      return (
        <Tooltip
          title={`If ${
            record.conditionTarget
          } price is more than ${normalizeBigNumber(record.conditionPrice)} $`}
        >
          GTE
        </Tooltip>
      );
    },
  },
  {
    title: "Trade Condition Price",
    dataIndex: "conditionPrice",
    key: "conditionPrice",
    render: (text) => {
      if (!text) {
        return "-";
      }

      return `${normalizeBigNumber(text)} $`;
    },
  },
  {
    title: "Expiration Date",
    dataIndex: "expireAfter",
    key: "expireAfter",
    render: (text) => {
      if (!text) {
        return "-";
      }

      return moment(text).format("YYYY MMM ddd HH:mm:ss");
    },
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: (text, record) => {
      if (record.state === "TRADING") {
        return "Trading...";
      }

      return (
        <Popconfirm
          title="Are you sure you want to cancel this trade?"
          onConfirm={() =>
            deleteActiveTradeApi(userSystemToken, record._id)
              .then(() => {
                message.success("Trade canceled. refresh the page");
              })
              .catch(() => {
                message.error("could not cancel the trade.");
              })
          }
        >
          <Button type="primary" danger>
            Cancel
          </Button>
        </Popconfirm>
      );
    },
  },
];

export default function ActiveTradesView() {
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState([]);
  const userSystemToken = useSelector((state) => state.user.token);

  useEffect(() => {
    async function loadData() {
      try {
        const activeTradesRes = await getActiveTrades(userSystemToken);
        setTrades(activeTradesRes);

        setLoading(false);
      } catch (e) {
        message.error("cannot load data " + e);
      }
    }

    loadData();
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
      <Table
        columns={columns(userSystemToken)}
        dataSource={trades}
        pagination={false}
      />
    </AppLayout>
  );
}
