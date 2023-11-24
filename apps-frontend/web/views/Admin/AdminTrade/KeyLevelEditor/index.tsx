import statsGetManyKeyLevels from '@fishprovider/cross/dist/api/stats/getManyKeyLevels';
import { useEffect } from 'react';

import { watchUserInfoController } from '~controllers/user.controller';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';

import KeyLevelTimeFrEditor from './KeyLevelTimeFrEditor';

function KeyLevelEditor() {
  const {
    symbol = '',
  } = watchUserInfoController((state) => ({
    symbol: state.activeSymbol,
  }));

  useEffect(() => {
    if (symbol) {
      statsGetManyKeyLevels({ symbol });
    }
  }, [symbol]);

  return (
    <Stack>
      <Title size="h3">📉 Key Levels</Title>
      <Group align="start">
        {['Hour1', 'Hour4', 'Daily'].map(((timeFr) => (
          <KeyLevelTimeFrEditor key={timeFr} symbol={symbol} timeFr={timeFr} />
        )))}
      </Group>
    </Stack>
  );
}

export default KeyLevelEditor;
