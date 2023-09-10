import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';

import KeyLevelTimeFr from './KeyLevelTimeFr';

interface Props {
  symbol: string;
}

function KeyLevel({ symbol }: Props) {
  return (
    <Stack>
      <Title size="h3">📉 Key Levels</Title>
      <Group align="start">
        {['Hour1', 'Hour4', 'Daily'].map(((timeFr) => (
          <KeyLevelTimeFr key={timeFr} symbol={symbol} timeFr={timeFr} />
        )))}
      </Group>
    </Stack>
  );
}

export default KeyLevel;
