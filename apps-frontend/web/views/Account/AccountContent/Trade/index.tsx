import dynamic from 'next/dynamic';

import Skeleton from '~ui/core/Skeleton';
import Stack from '~ui/core/Stack';

const TradeWatch = dynamic(() => import('./TradeWatch'));
const LockBanner = dynamic(() => import('./LockBanner'));
const BotSettings = dynamic(() => import('./BotSettings'), { loading: () => <Skeleton height={50} /> });
const OpenOrder = dynamic(() => import('~components/order/OpenOrder'), { loading: () => <Skeleton height={40} /> });
const ListTrade = dynamic(() => import('./ListTrade'), { loading: () => <Skeleton height={200} /> });
const Tools = dynamic(() => import('./Tools'), { loading: () => <Skeleton height={200} /> });

function Trade() {
  return (
    <Stack pt="md">
      <TradeWatch />
      <LockBanner />
      <BotSettings />
      <OpenOrder />
      <ListTrade />
      <Tools />
    </Stack>
  );
}

export default Trade;
