import dynamic from 'next/dynamic';

import Skeleton from '~ui/core/Skeleton';
import Stack from '~ui/core/Stack';

const HistoryWatch = dynamic(() => import('./HistoryWatch'));
const ListHistory = dynamic(() => import('./ListHistory'), { loading: () => <Skeleton height={200} /> });

function History() {
  return (
    <Stack pt="md">
      <HistoryWatch />
      <ListHistory />
    </Stack>
  );
}

export default History;
