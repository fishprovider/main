import dynamic from 'next/dynamic';

import { watchUserInfoController } from '~controllers/user.controller';

const AdvancedRealTimeChart = dynamic(
  () => import('react-ts-tradingview-widgets').then((item) => item.AdvancedRealTimeChart),
  { ssr: false },
);

function ChartTradingView() {
  const {
    symbol,
    theme,
  } = watchUserInfoController((state) => ({
    symbol: state.activeSymbol,
    theme: state.theme,
  }));
  return (
    <AdvancedRealTimeChart
      symbol={symbol}
      theme={theme === 'dark' ? 'dark' : 'light'}
      width="100%"
      interval="60"
      studies={[
        {
          id: 'MAExp@tv-basicstudies',
          inputs: {
            length: 20,
          },
        },
        {
          id: 'MAExp@tv-basicstudies',
          inputs: {
            length: 50,
          },
        },
        {
          id: 'RSI@tv-basicstudies',
          inputs: {
            length: 14,
          },
        },
      ] as any[]}
    />
  );
}

export default ChartTradingView;
