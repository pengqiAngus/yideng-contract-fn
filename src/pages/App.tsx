import * as React from 'react';
import { useRoutes } from 'react-router-dom';
import PageNotFoundView from '@/components/common/PageNotFoundView';
import MainLayout from '@/layouts/Layout';
import Web3ProviderLayout from '@/layouts/web3ProviderLayout';
import DappTest from '@/pages/DappTest';
import DappTest2 from '@/pages/DappTest2';
import Home from '@/pages/Home';
import { lazy, Suspense } from 'react';
import Loading from '@/components/common/Loading';	
import RrwebPage from '@/pages/Rrweb';
const AsyncTest = lazy(() => import('@/asyncComponents/common/AsyncTest'));

const Layout = () => (
  <Suspense fallback={<Loading />}>
    <MainLayout />
  </Suspense>
);
const App = () => {
  const routing = useRoutes([mainRoutes, asyncRoutes]);
  if (process.env.NODE_ENV === 'development') {
    console.log('development');
  }
  return routing;
};

const mainRoutes = {
  path: '/',
  element: <Layout />,
  children: [
    { path: '*', element: <PageNotFoundView /> },
    { path: '/dapp', element: <DappTest2 /> },
    { path: '/', element: <Home /> },
    { path: '/rrweb', element: <RrwebPage /> },
    { path: '404', element: <PageNotFoundView /> },
  ],
};
const asyncRoutes = {
  path: 'yideng',
  element: <Layout />,
  children: [{ path: 'async-test', element: <AsyncTest /> }],
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
