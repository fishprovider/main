import { watchUserInfoController } from '~controllers/user.controller';

import ActiveProviderFetch from './ActiveProviderFetch';

interface Props {
  providerId: string;
  children: React.ReactNode;
}

function StrategyProvider({ providerId, children }: Props) {
  const activeProviderId = watchUserInfoController((state) => state.activeAccount?._id);
  return (
    <>
      <ActiveProviderFetch providerId={providerId} />
      {activeProviderId && children}
    </>
  );
}

export default StrategyProvider;
