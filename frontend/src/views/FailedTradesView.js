/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import AppLayout from "src/components/AppLayout";
import { Spin, message, Table, Tooltip, Modal, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import getFailedTrades from "src/api/getFailedTrades";
import { useSelector } from "react-redux";
import normalizeBigNumber from "src/normalizeBigNumber";
import moment from "moment";

const columns = [
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
    title: "Creation Date",
    dateIndex: "createdAt",
    key: "createdAt",
    render: (text, record) => {
      return moment(record.createdAt).format("YYYY MMM ddd HH:mm:ss");
    },
  },
  {
    title: "Error Time",
    dataIndex: "completeTime",
    key: "completeTime",
    render: (text) => moment(text).format("YYYY MMM ddd HH:mm:ss"),
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions",
    render: (text, record) => {
      return (
        <Button
          onClick={() => {
            Modal.info({
              title: "Error Message",
              content: <code>{record.errorMessage}</code>,
            });
          }}
        >
          Show Error
        </Button>
      );
    },
  },
];

export default function FailedTradesView() {
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState([]);
  const userSystemToken = useSelector((state) => state.user.token);

  useEffect(() => {
    async function loadData() {
      try {
        const getFailedTradesRes = await getFailedTrades(userSystemToken);
        setTrades(getFailedTradesRes);

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
      <Table columns={columns} dataSource={trades} pagination={false} />
    </AppLayout>
  );
}
