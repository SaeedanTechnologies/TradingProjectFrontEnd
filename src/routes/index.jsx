import React from 'react';
import { createBrowserRouter,  Navigate } from 'react-router-dom';
import RootLayout from '../Pages/MainLayout/RootLayout';
import Dashboard from '../Pages/Dashboard';
import BrandList from '../Pages/Brand/BrandList';
import BrandSettings from '../Pages/BrandSettings';
import TradingAccount from '../Pages/TradingAccount';
import TradingAccountEntry from '../Pages/TradingAccount/TradingAccountEntry';
import SingleTradingAccount from '../Pages/SingleTradingAccount';
import TradingAccountDetails from '../Pages/TradingAccount/TradingAccountDetails';



export const router = createBrowserRouter([
  
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/brand", element: <BrandList /> },
      { path: "/brand-settings", element: <BrandSettings /> },
      { path: "/trading-accounts", element: <TradingAccount /> },
      { path: "/trading-accounts/:id", element: <TradingAccountEntry /> },
      { path: "/single-trading-accounts", element: <SingleTradingAccount /> },
      { path: "/single-trading-accounts/details", element: <TradingAccountDetails /> },
    ],
  },
]);