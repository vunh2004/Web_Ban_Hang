import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;

// Thêm tham số `path` vào hàm getItem
function getItem(label, key, icon, path, children) {
  return {
    key,
    icon,
    children,
    label: path ? <Link to={path}>{label}</Link> : label, // Sử dụng path để tạo Link
  };
}

const items = [
  getItem("Dashboard", "1", <PieChartOutlined />, "/admin/dashboard"),
  // Thêm submenu cho Products
  getItem("Products", "sub3", <DesktopOutlined />, null, [
    getItem("Product List", "10", null, "/admin/products/list"),
    getItem("Add Product", "11", null, "/admin/products/add"),
  ]),
  getItem("User", "sub1", <UserOutlined />, null, [
    getItem("Tom", "3", null, "/admin/user/tom"),
    getItem("Bill", "4", null, "/admin/user/bill"),
    getItem("Alex", "5", null, "/admin/user/alex"),
  ]),
  getItem("Category", "sub2", <TeamOutlined />, null, [
    getItem("Category List", "6", null, "/admin/categories/list"),
    getItem("Add Category", "8", null, "/admin/categories/add"),
  ]),
  getItem("Files", "9", <FileOutlined />, "/admin/files"),
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
        <div className="demo-logo-vertical" />
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
          {/* <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
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
