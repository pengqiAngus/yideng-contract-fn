;import * as React from "react";
import { useRoutes } from "react-router-dom";
import PageNotFoundView from "@/components/common/PageNotFoundView";
import MainLayout from "@/layouts/Layout";
import Web3ProviderLayout from "@/layouts/web3ProviderLayout";
import DappTest from "@/pages/DappTest";
import DappTest2 from "@/pages/DappTest2";
import Home from "@/pages/Home";
const App = () => {
  const routing = useRoutes([mainRoutes]);
  if (process.env.NODE_ENV === "development") {
    console.log("development");
  }
  return routing;
};

const mainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    { path: "*", element: <PageNotFoundView /> },
    { path: "/dapp", element: <DappTest2 /> },
    { path: "/", element: <Home /> },
    { path: "404", element: <PageNotFoundView /> },
  ],
};

export default App;

// import * as React from "react";
// import { useRoutes } from "react-router-dom";
// import PageNotFoundView from "@/components/common/PageNotFoundView";
// import MainLayout from "@/layouts/Layout";
// import DappTest from "@/pages/DappTest";
// import Home from "@/pages/Home";
// function App() {
//   let element = useRoutes([
//     {
//       path: "/",
//       element: <MainLayout />,
//       children: [
//         {
//           path: "/",
//           element: <Home />,
//         },
//         { path: "/dappTest", element: <DappTest /> },
//       ],
//     },
//   ]);

//   return element;
// }
// export default App;
