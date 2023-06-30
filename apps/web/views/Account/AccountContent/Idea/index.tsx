import dynamic from 'next/dynamic';

import Skeleton from '~ui/core/Skeleton';
import Stack from '~ui/core/Stack';

const IdeaWatch = dynamic(() => import('./IdeaWatch'));
const ListTradeIdea = dynamic(() => import('./ListTradeIdea'), { loading: () => <Skeleton height={200} /> });

function Idea() {
  return (
    <Stack pt="md">
      <IdeaWatch />
      <ListTradeIdea />
    </Stack>
  );
}

export default Idea;
