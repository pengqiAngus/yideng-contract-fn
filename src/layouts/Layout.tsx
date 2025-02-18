import { memo } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/common/Header";
const Layout = () => {
    return (
      <>
        <Header></Header>  
        <main className="mx-auto px-4">
          <Outlet />
        </main>
      </>
    );
}

export default memo(Layout)