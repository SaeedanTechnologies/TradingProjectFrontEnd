import { useSelector } from 'react-redux';
import { Route, Navigate } from 'react-router-dom';

import TerminalDashboard,{ Terminal,MarketNews,EconomicCalender,WatchMarket,Journal,ActiveOrders,OrderHistory,PendingOrders } from '../../Pages/Terminal';


const TerminalRoutes = () => {

  const isAuthenticated = useSelector(state => state?.terminal?.user?.token !== null);

  return (
    <>
      {/* Route accessible only when token is not present */}
      {!isAuthenticated && (
        <Route path="/terminal" element={<Terminal />} />
      )}

      {/* Routes accessible when token is present */}
      {isAuthenticated && (
        <Route path="/terminal" element={<TerminalDashboard />}>
          <Route path="market-watch" element={<WatchMarket />} />
          <Route path="economic-calendar" element={<EconomicCalender />} />
          <Route path="market-news" element={<MarketNews />} />
          <Route path="active-order" element={<ActiveOrders />} />
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="pending-orders" element={<PendingOrders />} />
          <Route path="journal" element={<Journal />} />
        </Route>
      )}

      {/* Redirect to login if token is not present */}
      
       {isAuthenticated ? (
        <Navigate to="/terminal/market-watch" replace />
      ) : (
        <Navigate to="/terminal" replace />
      )}

    </>
  );
};

export default TerminalRoutes;
