import { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { useState } from 'react';

import { ProviderTypePrice, ProviderTypeText } from '~constants/account';
import Select from '~ui/core/Select';
import Stack from '~ui/core/Stack';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';

import AccountCTrader from './AccountCTrader';
import AccountMetaTrader from './AccountMetaTrader';

const supportProviderTypes = [
  ProviderType.icmarkets,
  ProviderType.exness,
];

function AccountOpen() {
  const [providerType, setProviderType] = useState(supportProviderTypes[0]);

  const renderPlatformSelect = () => (
    <Select
      label="Choose your favorite platform"
      data={supportProviderTypes.map((item) => ({
        value: item,
        label: `${ProviderTypeText[item]} (${ProviderTypePrice[item]})`,
      }))}
      value={providerType}
      onChange={(value) => {
        if (!value) return;
        setProviderType(value as ProviderType);
      }}
    />
  );

  const renderPlatformGuide = () => {
    switch (providerType) {
      case ProviderType.icmarkets: return <AccountCTrader />;
      case ProviderType.exness: return <AccountMetaTrader providerType={providerType} />;
      default: return <div>Coming soon... 🧱🚧🏗️👷👷‍♀️🧑‍🏭🛠️🔩⚒️🔨</div>;
    }
  };

  return (
    <ContentSection>
      <Stack py="xl">
        <Title>Open Account</Title>
        {renderPlatformSelect()}
        {renderPlatformGuide()}
      </Stack>
    </ContentSection>
  );
}

export default AccountOpen;
