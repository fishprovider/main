import storeUser from '@fishbot/cross/stores/user';
import dynamic from 'next/dynamic';

import useToggle from '~hooks/useToggle';
import Group from '~ui/core/Group';
import Switch from '~ui/core/Switch';
import Title from '~ui/core/Title';

const EconomicCalendar = dynamic(
  () => import('react-ts-tradingview-widgets').then((item) => item.EconomicCalendar),
  { ssr: false },
);
const Timeline = dynamic(
  () => import('react-ts-tradingview-widgets').then((item) => item.Timeline),
  { ssr: false },
);

interface Props {
  showAll?: boolean;
}

function NewsTradingView({ showAll }: Props) {
  const {
    theme,
  } = storeUser.useStore((state) => ({
    theme: state.theme,
  }));

  const [enabled, toggleEnabled] = useToggle();

  return (
    <>
      <Group>
        <Title size="h3">TradingView News</Title>
        <Switch
          checked={enabled}
          onChange={() => toggleEnabled()}
          label="Show"
        />
      </Group>
      {enabled && (
        <>
          <EconomicCalendar
            colorTheme={theme === 'dark' ? 'dark' : 'light'}
            width="100%"
            importanceFilter={showAll ? '-1,0,1' : '0,1'}
          />
          <Timeline
            colorTheme={theme === 'dark' ? 'dark' : 'light'}
            width="100%"
            feedMode="all_symbols"
          />
        </>
      )}
    </>
  );
}

export default NewsTradingView;
