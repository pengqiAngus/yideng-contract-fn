import { memo } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/common/HeaderConnectKit";
import Web3Provider from "@/pages/Web3Provider";
const Layout = () => {
  return (
    <Web3Provider>
      <Header></Header>
      <main className="mx-auto px-4">
        <Outlet />
      </main>
    </Web3Provider>
  );
};

export default memo(Layout);
