import React, { useContext, useEffect } from "react";
import { Breadcrumb, Layout, Menu, theme, Button } from "antd";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import { Store } from "../../store/store";
import axios from "axios";

const { Header, Content, Sider } = Layout;
const items1 = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);
    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,
      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  }
);

const Dashboard = () => {
  const navigate = useNavigate();
  const store = useContext(Store);

  useEffect(() => {
    async function getUsers() {
      const token = localStorage.getItem("accessToken");
      console.log("token", token);
      try {
        const users = await axios.get("http://localhost:3010/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        return users;
      } catch (error) {
        if (error.response.status === 401) {
          //Refresh token
          console.log("Expired token --> Refresh");
          const refreshToken = localStorage.getItem("refreshToken");
          const response = await axios.post(
            "http://localhost:3010/refresh-token",
            {
              accessToken: token,
              refreshToken: refreshToken,
            }
          );
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);

          //Goi lai ham`
          return getUsers();
        }
        console.log("error");
      }
    }

    getUsers().then(console.log);
  }, []);

  const handleClickBtn = () => {
    localStorage.removeItem("accessToken");
    store.login = false;
    navigate("/");
  };

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Header className="header">
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={items1}
        ></Menu>
      </Header>
      <Layout>
        <Sider
          width={200}
          style={{
            background: colorBgContainer,
          }}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            style={{
              height: "100%",
              borderRight: 0,
            }}
            items={items2}
          />
        </Sider>
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <Button className="btn" onClick={handleClickBtn} type="primary">
              Log out
            </Button>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default Dashboard;
