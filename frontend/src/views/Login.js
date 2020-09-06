import React from "react";
import { Form, Input, Button, message } from "antd";
import getActiveTrades from "src/api/getActiveTrades";
import { useHistory } from "react-router-dom";
import userLogin from "src/actions/login";
import { DASHBOARD_ROUTE } from "src/routes";

export default function Login() {
  const history = useHistory();
  const onFinish = async (data) => {
    try {
      await getActiveTrades(data.password);
      userLogin(data.password);
      history.push(DASHBOARD_ROUTE);
    } catch (e) {
      message.error("cannot login");
    }
  };

  return (
    <div style={{ width: "30vw", padding: 24 }}>
      <Form name="login" onFinish={onFinish}>
        <Form.Item
          label="password"
          name="password"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
