import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootLayout from '../Pages/MainLayout/RootLayout';
import Dashboard from '../Pages/Dashboard';
import BrandList from '../Pages/Brand/BrandList';
import BrandSettings from '../Pages/BrandSettings';
import TradingAccount from '../Pages/TradingAccount';
import TradingAccountEntry from '../Pages/TradingAccount/TradingAccountEntry';
import SingleTradingAccount from '../Pages/SingleTradingAccount';
import TradingAccountDetails from '../Pages/TradingAccount/TradingAccountDetails';
import LiveOrders from '../Pages/LiveOrders/LiveOrders';
import CloseOrder from '../Pages/CloseOrder/CloseOrder';
import TransactionOrders from '../Pages/TransactionOrders/TransactionOrders';
import TransactionOrderEntry from '../Pages/TransactionOrders/TransactionOrderEntry';
import Reports from '../Pages/Reports';
import TradingAccountGroup from '../Pages/TradingAccountGroup';
import MBTradingOrder from '../Pages/TradingAccountGroup/MBTradingOrder';
import MassDipositWidthdraw from '../Pages/TradingAccountGroup/MassDipositWidthdraw';
import MDWEntry from '../Pages/TradingAccountGroup/MDWEntry';
import TradingGroupEntry from '../Pages/TradingAccountGroup/TradingGroupEntry';
import Trade from '../Pages/TradingAccount/Trade';
import LiveOrderEntry from '../Pages/TradingAccount/LiveOrderEntry';
import ActiveTradingAccount from '../Pages/TradingAccount/ActiveTradingAccount';
import SymbolGroup from '../Pages/Symbols/SymbolGroup';
import SymbolGroupEntry from '../Pages/Symbols/SymbolGroup/SymbolGroupEntry';
import SymbolSettings from '../Pages/Symbols/SymbolSettings';
import SymbolSettingsEntry from '../Pages/Symbols/SymbolSettings/SymbolSettingsEntry';
import DataFeed from '../Pages/Symbols/DataFeed';
import TicketCharts from '../Pages/Symbols/TicketCharts'
import MinChart from '../Pages/Symbols/MinChart'
import Settings from '../Pages/Settings'
import Firewall from '../Pages/Settings/Firewall'
import MarginCallsLevel from '../Pages/Settings/MarginCallsLevel'
import ChangePassword from '../Pages/Settings/ChangePassword'
import TradingViewChart from '../Pages/Brand/TradingViewChart';
import AuthLayout from '../Pages/Auth/AuthLayout';
import SignIn from '../Pages/Auth/SignIn';
import PersonalData from '../Pages/TradingAccount/PersonalData';
import Account from '../Pages/TradingAccount/Account';
import TransactionOrder from '../Pages/TradingAccount/TransactionOrder';
import EditLiveOrder from '../Pages/TradingAccount/EditLiveOrder'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "sign-in", element: <SignIn /> },
      { path: "/", element: <Navigate to="sign-in" replace /> }
    ],
  },

  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/dashboard-reports", element: <Reports /> },
      { path: "/brand", element: <BrandList /> },
      { path: "/brand-settings", element: <BrandSettings /> },
      { path: "/trading-accounts", element: <TradingAccount direction={1} title="Trading Account List" /> },
      { path: "/trading-accounts/:id", element: <TradingAccountEntry /> },
      { path: "/trading-group", element: <TradingAccountGroup /> },
      { path: "/trading-group/:id", element: <TradingGroupEntry /> },
      { path: "/trading-group/mb-to/:id", element: <MBTradingOrder /> },
      { path: "/trading-group/mb-to/:id/:massid", element: <Trade /> },
      { path: "/trading-group/mass-deposit/:id", element: <MassDipositWidthdraw /> },
      { path: "/trading-group/mass-deposit/:id/:massid", element: <MDWEntry /> },
      { path: "/single-trading-accounts", element: <SingleTradingAccount /> },
      {
        path: "/single-trading-accounts/details", element: <TradingAccountDetails />, children: [
          { path: "live-order", element: <LiveOrders /> },
          { path: "symbol", element: <Trade /> },
          { path: "close-order", element: <CloseOrder /> },
          { path: "personal-data", element: <PersonalData /> },
          { path: "account-security", element: <Account /> },
          { path: "transaction-order", element: <TransactionOrder /> },
        ]
      },
      { path: "/single-trading-accounts/details/live-order/:orderId", element: <EditLiveOrder /> },
      { path: "/live-orders", element: <LiveOrders /> },
      { path: "/close-orders", element: <CloseOrder /> },
      { path: "/transaction-orders", element: <TransactionOrders /> },
      { path: "/transaction-orders/:id", element: <TransactionOrderEntry /> },
      { path: "/active-accounts", element: <TradingAccount title={"Active Trading Account List"} direction={2} /> },
      { path: "/margin-calls", element: <TradingAccount direction={3} title="Margin Call Trading Account List" /> },
      { path: "/symbol-groups", element: <SymbolGroup /> },
      { path: "/symbol-groups/:id", element: <SymbolGroupEntry /> },
      { path: "/symbol-settings", element: <SymbolSettings /> },
      { path: "/symbol-settings/:id", element: <SymbolSettingsEntry /> },
      { path: "/data-feed", element: <DataFeed /> },
      { path: "/ticket-charts", element: <TicketCharts /> },
      { path: "/min-charts", element: <MinChart /> },
      { path: "/settings", element: <Settings /> },
      { path: "/firewall", element: <Firewall /> },
      { path: "/margin-levels", element: <MarginCallsLevel /> },
      { path: "/change-password", element: <ChangePassword /> },
      { path: "/Test", element: <TradingViewChart /> },
    ],
  },
]);