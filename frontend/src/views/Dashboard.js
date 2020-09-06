import React from "react";
import AppLayout from "src/components/AppLayout";
import { Row, Col } from "antd";

export default function Dashboard() {
  return (
    <AppLayout>
      <Row>
        <Col span={12}>salam</Col>
        <Col span={12}>bye</Col>
      </Row>
    </AppLayout>
  );
}
