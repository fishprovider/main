import storeUser from '@fishprovider/cross/stores/user';
import dynamic from 'next/dynamic';

import useToggle from '~hooks/useToggle';
import Group from '~ui/core/Group';
import Switch from '~ui/core/Switch';
import Title from '~ui/core/Title';

const TechnicalAnalysis = dynamic(
  () => import('react-ts-tradingview-widgets').then((item) => item.TechnicalAnalysis),
  { ssr: false },
);

function SignalTradingView() {
  const {
    symbol,
    theme,
  } = storeUser.useStore((state) => ({
    symbol: state.activeSymbol,
    theme: state.theme,
  }));

  const [enabled, toggleEnabled] = useToggle();

  return (
    <>
      <Group>
        <Title size="h3">TradingView Signals</Title>
        <Switch
          checked={enabled}
          onChange={() => toggleEnabled()}
          label="Show"
        />
      </Group>
      {enabled && (
        <TechnicalAnalysis
          symbol={symbol}
          colorTheme={theme === 'dark' ? 'dark' : 'light'}
          width="100%"
          interval="1h"
        />
      )}
    </>
  );
}

export default SignalTradingView;
