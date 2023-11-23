import storeUser from '@fishprovider/cross/dist/stores/user';

import ActiveProviderFetch from './ActiveProviderFetch';

interface Props {
  providerId: string;
  children: React.ReactNode;
}

function StrategyController({ providerId, children }: Props) {
  const activeProviderId = storeUser.useStore((state) => state.activeProvider?._id);

  Logger.debug('[render] StrategyController', providerId, activeProviderId);
  return (
    <>
      <ActiveProviderFetch providerId={providerId} />
      {activeProviderId && children}
    </>
  );
}

export default StrategyController;
