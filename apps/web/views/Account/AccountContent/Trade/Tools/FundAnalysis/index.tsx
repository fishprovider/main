import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';

import News from './News';
import NewsTradingView from './NewsTradingView';

function FundAnalysis() {
  return (
    <Stack>
      <Title size="h3">📚 Fundamental Analysis</Title>
      <News />
      <NewsTradingView />
    </Stack>
  );
}

export default FundAnalysis;
