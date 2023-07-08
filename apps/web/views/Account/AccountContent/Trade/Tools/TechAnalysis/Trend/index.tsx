import statsGetManyTrends from '@fishprovider/cross/api/stats/getManyTrends';
import storeStats from '@fishprovider/cross/stores/stats';
import _ from 'lodash';
import { useEffect } from 'react';

import Box from '~ui/core/Box';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';

interface Props {
  symbol: string;
}

function Trend({ symbol }: Props) {
  const trend = storeStats.useStore((state) => _.find(
    state,
    (item) => item.type === 'trends' && item.symbol === symbol,
  ));

  useEffect(() => {
    if (symbol) {
      statsGetManyTrends({ symbol });
    }
  }, [symbol]);

  const getColor = (side?: string) => {
    if (side === 'Down') return 'red';
    if (side === 'Up') return 'green';
    return '';
  };

  return (
    <Stack>
      <Title size="h3">📈 Trend</Title>
      <Box>
        <Text color={getColor(trend?.h1)}>
          {`H1: ${trend?.h1 || ''}`}
        </Text>
        <Text color={getColor(trend?.h4)}>
          {`H4: ${trend?.h4 || ''}`}
        </Text>
        <Text color={getColor(trend?.d1)}>
          {`D1: ${trend?.d1 || ''}`}
        </Text>
      </Box>
    </Stack>
  );
}

export default Trend;
