import dynamic from 'next/dynamic';

import Skeleton from '~ui/core/Skeleton';
import Stack from '~ui/core/Stack';

const ProviderBreadcrumbs = dynamic(() => import('./ProviderBreadcrumbs'), { loading: () => <Skeleton height={40} /> });
const BannerStatus = dynamic(() => import('~components/account/BannerStatus'));

function ProviderHeader() {
  return (
    <Stack>
      <ProviderBreadcrumbs />
      <BannerStatus />
    </Stack>
  );
}

export default ProviderHeader;
