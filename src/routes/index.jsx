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
import EditLiveOrder from '../Pages/TradingAccount/EditLiveOrder';
import NewFeedData from '../Pages/Symbols/DataFeed/NewFeedData'
import BrandPermissions from '../Pages/BrandPermissions/BrandPermissions';
import TradingAccountsEntry from '../Pages/TradingAccount/TradingAccountsEntry';
import LiveOrdersEntery from '../Pages/LiveOrders/LiveOrdersEntery';
import CloseOrdersEntery from '../Pages/CloseOrder/CloseOrderEntery';
import PendingOrder from '../Pages/TradingAccount/PendingOrder';
import AllPendingOrder from '../Pages/PendingOrder/PendingOrder';
import BrandEntry from '../Pages/Brand/BrandEntry';
import PendingOrderEntry from '../Pages/PendingOrder/PendingOrderEntry';
import TradingAccountLiveOrdersEntry from '../Pages/TradingAccount/TradingAccountLiveOrdersEntry';
import TradingAccountPendingOrdersEntry from '../Pages/TradingAccount/TradingAccountPendingOrderEntry';
import TradingAccountCloseOrdersEntry from '../Pages/TradingAccount/TradingAccountCloseOrdersEntry'
import TradingAccountTransactionOrdersEntry from '../Pages/TradingAccount/TradingAccountTransactionOrdersEntry';
import MarginCallEntry from '../Pages/TradingAccount/MarginCallEntry';


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
      { path: "/brand-entry", element: <BrandEntry /> },
      { path: "/brand-permissions", element: <BrandPermissions /> },
      { path: "/brand-settings", element: <BrandSettings /> },
      { path: "/trading-accounts", element: <TradingAccount direction={1} title="Trading Account List" /> },
      { path: "/trading-accounts/:id", element: <TradingAccountEntry /> },
      { path: "/trading-accounts-entry",element: <TradingAccountsEntry/>},
      { path: "/trading-group", element: <TradingAccountGroup /> },
      { path: "/trading-group-entry", element: <TradingGroupEntry /> },
      { path: "/trading-group/mb-to", element: <MBTradingOrder /> },
      { path: "/trading-group/mb-to/create", element: <Trade /> },
      { path: "/trading-group/mass-deposit", element: <MassDipositWidthdraw /> },
      { path: "/trading-group/mass-deposit/create", element: <MDWEntry /> },
      { path: "/single-trading-accounts", element: <SingleTradingAccount /> },
      {
        path: "/single-trading-accounts/details", element: <TradingAccountDetails />, children: [
          { path: "live-order", element: <LiveOrders /> },
          { path: "symbol", element: <Trade /> },
          { path: "close-order", element: <CloseOrder /> },
          // { path: "close-order-entry",element:<TradingAccountCloseOrdersEntry/> },
          { path: "pending-order", element: <PendingOrder /> },
          // { path: "pending-order-entry",element:<TradingAccountPendingOrdersEntry/> },
          { path: "personal-data", element: <PersonalData /> },
          { path: "account-security", element: <Account /> },
          { path: "transaction-order", element: <TransactionOrder /> },
         
        ]
      },
       {path: "/single-trading-accounts/details/transaction-order-entry",element:<TradingAccountTransactionOrdersEntry/>},
      { path: "/single-trading-accounts/details/live-order/:orderId", element: <EditLiveOrder /> },
      { path:"/single-trading-accounts/details/live-order-entry",element:<TradingAccountLiveOrdersEntry/>},
      { path: "/live-orders", element: <LiveOrders /> },

      { path:"/live-orders-entry", element:<LiveOrdersEntery/>},
      { path: "/close-orders", element: <CloseOrder /> },
      { path:"/close-orders-entry",element:<CloseOrdersEntery/>},
      { path: "/pending-orders", element: <AllPendingOrder /> },
      { path: "/pending-orders-entry", element: <PendingOrderEntry /> },
      { path: "/transaction-orders", element: <TransactionOrders /> },
      { path: "/transaction-orders-entry", element: <TransactionOrderEntry /> },
      { path: "/active-accounts", element: <TradingAccount title={"Active Trading Account List"} direction={2} /> },
      { path: "/margin-calls", element: <TradingAccount direction={3} title="Margin Call Trading Account List" /> },
      { path: "/margin-calls-entry", element: <MarginCallEntry direction={3} title="Margin Call Trading Account List" /> },
      { path: "/symbol-groups", element: <SymbolGroup /> },
      { path: "/symbol-groups-entry", element: <SymbolGroupEntry /> },
      { path: "/symbol-settings", element: <SymbolSettings /> },
      { path: "/symbol-settings-entry", element: <SymbolSettingsEntry /> },
      { path: "/data-feed", element: <DataFeed /> },
      { path: "/data-feed/:id", element: <NewFeedData /> },
      { path: "/ticket-charts", element: <TicketCharts /> },
      { path: "/min-charts", element: <MinChart /> },
      { path: "/settings", element: <Settings /> },
      { path: "/firewall", element: <Firewall /> },
      { path: "/margin-levels", element: <MarginCallsLevel /> },
      { path: "/change-password", element: <ChangePassword /> },
      { path: "/Chart", element: <TradingViewChart  /> },
    ],
  },
]);