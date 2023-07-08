import storeAccounts from '@fishprovider/cross/stores/accounts';
import { ProviderPlatform, SourceType } from '@fishprovider/utils/constants/account';
import _ from 'lodash';
import { useState } from 'react';

import {
  ctraderPlatforms, metatraderPlatforms,
} from '~constants/account';
import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Select from '~ui/core/Select';
import Stack from '~ui/core/Stack';
import { isLive } from '~utils';

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
    sourceType,
  } = storeAccounts.useStore((state) => ({
    providerGroupId: state[providerId]?.providerGroupId,
    sourceType: state[providerId]?.sourceType,
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
  const canInvestFishCT = sourceType === SourceType.admin || !isLive;

  const platforms: { label: string, value: ProviderPlatform }[] = [
    ...(canInvestCTrader ? [
      { label: 'CTrader (Spotware)', value: ProviderPlatform.ctrader },
    ] : []),
    ...(canInvestMetaTrader ? [
      { label: 'MetaTrader (MT4/MT5)', value: ProviderPlatform.metatrader },
    ] : []),
    ...(canInvestFishCT ? [
      { label: 'FishCT (FishPlatform)', value: ProviderPlatform.fishct },
    ] : []),
  ];

  const [platformInput, setPlatformInput] = useState<ProviderPlatform>();

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
