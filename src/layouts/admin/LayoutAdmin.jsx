import React, { useState } from "react";
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Avatar, Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, path, children) {
  return {
    key,
    icon,
    children,
    label: path ? <Link to={path}>{label}</Link> : label,
  };
}

const items = [
  getItem("Dashboard", "1", <PieChartOutlined />, "/admin/dashboard"),
  getItem("Products", "sub3", <DesktopOutlined />, null, [
    getItem("Product List", "10", null, "/admin/products/list"),
    getItem("Add Product", "11", null, "/admin/products/add"),
  ]),
  getItem("User", "sub1", <UserOutlined />, null, [
    getItem("User List", "3", null, "users/list"),
  ]),
  getItem("Category", "sub2", <AppstoreOutlined />, null, [
    getItem("Category List", "6", null, "/admin/categories/list"),
    getItem("Add Category", "8", null, "/admin/categories/add"),
  ]),
  getItem("Orders", "9", <ShoppingCartOutlined />, "/admin/orders/list"),
  getItem("Shop", "10", <ShopOutlined />, "/"),
];

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        {/* Avatar logo từ Picsum */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "16px 0",
          }}
        >
          <Link to={"/admin"}>
            <Avatar
              size={64}
              src="https://beedesign.com.vn/wp-content/uploads/2020/08/Thiet-ke-logo-dien-thoai-apple-123-14.jpg" // URL ảnh từ Picsum
              alt="Shop Logo"
            />
          </Link>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
