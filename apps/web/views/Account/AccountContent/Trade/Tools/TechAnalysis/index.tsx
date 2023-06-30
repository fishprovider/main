import storeUser from '@fishbot/cross/stores/user';

import SymbolsSelect from '~components/price/SymbolsSelect';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';

import Depth from './Depth';
import KeyLevel from './KeyLevel';
import Signals from './Signals';
import Trend from './Trend';

function TechAnalysis() {
  const activeSymbol = storeUser.useStore((state) => state.activeSymbol);

  return (
    <Stack>
      <Group>
        <Title size="h3">🕯️ Technical Analysis</Title>
        <SymbolsSelect hidePriceView />
      </Group>
      <Signals />
      <Trend symbol={activeSymbol} />
      <KeyLevel symbol={activeSymbol} />
      <Depth />
    </Stack>
  );
}

export default TechAnalysis;
