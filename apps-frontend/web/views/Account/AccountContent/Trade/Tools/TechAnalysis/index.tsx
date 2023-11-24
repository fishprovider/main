import SymbolsSelect from '~components/price/SymbolsSelect';
import { watchUserInfoController } from '~controllers/user.controller';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';

import Depth from './Depth';
import KeyLevel from './KeyLevel';
import Signals from './Signals';
import Trend from './Trend';

function TechAnalysis() {
  const activeSymbol = watchUserInfoController((state) => state.activeSymbol);

  return (
    <Stack>
      <Group>
        <Title size="h3">🕯️ Technical Analysis</Title>
        <SymbolsSelect hidePriceView />
      </Group>
      <Signals />
      {activeSymbol && <Trend symbol={activeSymbol} />}
      {activeSymbol && <KeyLevel symbol={activeSymbol} />}
      <Depth />
    </Stack>
  );
}

export default TechAnalysis;
