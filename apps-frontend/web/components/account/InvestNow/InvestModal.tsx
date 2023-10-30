import storeAccounts from '@fishprovider/cross/dist/stores/accounts';
import { ProviderPlatform } from '@fishprovider/utils/dist/constants/account';
import _ from 'lodash';
import { useState } from 'react';

import {
  ctraderPlatforms, metatraderPlatforms,
} from '~constants/account';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Select from '~ui/core/Select';
import Stack from '~ui/core/Stack';

import InvestFish from './InvestFish';
import InvestPlatforms from './InvestPlatforms';

interface Props {
  providerId: string;
  onClose?: () => void;
}

function InvestModal({
  providerId,
  onClose = () => undefined,
}: Props) {
  const {
    providerGroupId,
  } = storeAccounts.useStore((state) => ({
    providerGroupId: state[providerId]?.providerGroupId,
  }));

  const groupAccounts = storeAccounts.useStore((state) => _.filter(
    state,
    (item) => (providerGroupId
      ? item.providerGroupId === providerGroupId
      : item._id === providerId),
  ));

  const canInvestCTrader = groupAccounts.some(
    (item) => item.providerPlatform === ProviderPlatform.ctrader,
  );
  const canInvestMetaTrader = groupAccounts.some(
    (item) => item.providerPlatform === ProviderPlatform.metatrader,
  );

  const platforms: { label: string, value: ProviderPlatform }[] = [
    { label: 'CTrader (Spotware)', value: ProviderPlatform.ctrader },
    { label: 'MetaTrader (MT4/MT5)', value: ProviderPlatform.metatrader },
    { label: 'FishCT (FishPlatform)', value: ProviderPlatform.fishct },
  ];

  const [platformInput, setPlatformInput] = useState<ProviderPlatform>(ProviderPlatform.ctrader);

  const getDefaultPlatform = () => {
    if (canInvestCTrader) return ProviderPlatform.ctrader;
    if (canInvestMetaTrader) return ProviderPlatform.metatrader;
    return ProviderPlatform.fishct;
  };
  const platform = platformInput || getDefaultPlatform();

  const renderContent = () => {
    switch (platform) {
      case ProviderPlatform.ctrader: return (
        <InvestPlatforms
          providerId={providerId}
          providerPlatform={platform}
          groupAccounts={groupAccounts.filter((item) => item.providerPlatform === platform)}
          platforms={ctraderPlatforms}
        />
      );
      case ProviderPlatform.metatrader: return (
        <InvestPlatforms
          providerId={providerId}
          providerPlatform={platform}
          groupAccounts={groupAccounts.filter((item) => item.providerPlatform === platform)}
          platforms={metatraderPlatforms}
        />
      );
      case ProviderPlatform.fishct: return (
        <InvestFish
          providerId={providerId}
          onClose={onClose}
        />
      );
      default: return null;
    }
  };

  return (
    <Stack>
      <Select
        label="Select your preferred platform"
        data={platforms}
        value={platform}
        onChange={(value) => {
          if (value) setPlatformInput(value as ProviderPlatform);
        }}
        size="md"
      />
      {renderContent()}
      <Group position="right">
        <Button variant="subtle" onClick={onClose}>Close</Button>
      </Group>
    </Stack>
  );
}

export default InvestModal;
