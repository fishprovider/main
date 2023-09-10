import dynamic from 'next/dynamic';

import Skeleton from '~ui/core/Skeleton';
import Stack from '~ui/core/Stack';

const AccountBreadcrumbs = dynamic(() => import('./AccountBreadcrumbs'), { loading: () => <Skeleton height={40} /> });
const TopBanners = dynamic(() => import('./TopBanners'));
const BannerStatus = dynamic(() => import('~components/account/BannerStatus'));
const AccountBalance = dynamic(() => import('./AccountBalance'), { loading: () => <Skeleton height={40} /> });

function AccountHeader() {
  return (
    <Stack>
      <AccountBreadcrumbs />
      <TopBanners />
      <BannerStatus />
      <AccountBalance />
    </Stack>
  );
}

export default AccountHeader;
