import dynamic from 'next/dynamic';

import Skeleton from '~ui/core/Skeleton';

const InvestorStats = dynamic(() => import('./InvestorStats'), { loading: () => <Skeleton height={200} /> });
const Description = dynamic(() => import('./Description'), { loading: () => <Skeleton height={200} /> });
const AccountInvestors = dynamic(() => import('./AccountInvestors'), { loading: () => <Skeleton height={200} /> });
const AccountMembers = dynamic(() => import('./AccountMembers'), { loading: () => <Skeleton height={200} /> });

function ProviderContent() {
  return (
    <>
      <Description />
      <InvestorStats />
      <AccountInvestors />
      <AccountMembers />
    </>
  );
}

export default ProviderContent;
