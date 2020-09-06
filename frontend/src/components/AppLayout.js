import React from "react";
import { Layout, Menu } from "antd";
import { NavLink } from "react-router-dom";
import {
  CREATE_CONDITIONAL_TRADE_ROUTE,
  DASHBOARD_ROUTE,
  COMPLETED_TRADE_ROUTE,
  INSTANT_EXCHANGE_ROUTE,
  ACTIVE_TRADE_ROUTE,
  EXPIRED_TRADE_ROUTE,
  FAILED_TRADE_ROUTE,
} from "src/routes";

const { Content, Header } = Layout;

export default function AppLayout({ children }) {
  return (
    <Layout>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">
            <NavLink to={DASHBOARD_ROUTE}>Dashboard</NavLink>
          </Menu.Item>
          <Menu.Item key="2">
            <NavLink to={CREATE_CONDITIONAL_TRADE_ROUTE}>
              Create a new conditional trade
            </NavLink>
          </Menu.Item>
          <Menu.Item key="3">
            <NavLink to={INSTANT_EXCHANGE_ROUTE}>Instant Exchange</NavLink>
          </Menu.Item>
          <Menu.Item key="4">
            <NavLink to={ACTIVE_TRADE_ROUTE}>Active Trades</NavLink>
          </Menu.Item>
          <Menu.Item key="5">
            <NavLink to={COMPLETED_TRADE_ROUTE}>Completed Trades</NavLink>
          </Menu.Item>
          <Menu.Item key="6">
            <NavLink to={EXPIRED_TRADE_ROUTE}>Expired Trades</NavLink>
          </Menu.Item>
          <Menu.Item key="7">
            <NavLink to={FAILED_TRADE_ROUTE}>Failed Trades</NavLink>
          </Menu.Item>
        </Menu>
      </Header>
      <Content>
        <div style={{ padding: 24, backgroundColor: "white", marginTop: 64 }}>
          {children}
        </div>
      </Content>
    </Layout>
  );
}
