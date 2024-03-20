import React from 'react';
import { theme } from 'antd';

import CoinCard from './CoinCard';
import { DashboardCardData } from '../../utils/constants';
import CandleChart from '../../components/CandleChart';
import CustomTable from '../../components/CustomTable';

const Index = () => {
  const {
    token: { colorBG },
  } = theme.useToken();

  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <h1 className='text-2xl font-semibold py-12px'>Dashboard</h1>
      <div className="grid gap-4 p-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 ">
        {DashboardCardData.map((item) => (
          <CoinCard
            key={item.id}
            title={item.title}
            subtitle={item.subtitle}
            value={item.value}
            subvalue={item.subvalue}
            img_url={item.img_url}
            graph_url={item.graph_url}
            subvalue_color={item.subvalue_color}
          />
        ))}
      </div>
      <div className='my-8'>
        <h1 className='text-2xl font-semibold mb-8'>Reports</h1>
        <CandleChart />
      </div>
      <div className='bg-white p-4 border rounded-lg'>
        <CustomTable title={'Trading Accounts'} isHideColumns={true} />
      </div>
    </div>
  );
};

export default Index;
