import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Appbar from "./Appbar";

const RootLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout hasSider>
      <Sidebar collapsed={collapsed} />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 250,
        }}
      >
        <Appbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Outlet />
      </Layout>
    </Layout>
  );
};
export default RootLayout;
