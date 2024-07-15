import { AccountViewType } from '@fishprovider/core';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import { useState } from 'react';

import { CardVariant } from '~constants/account';
import { getAccountsController } from '~controllers/account.controller';
import { watchUserInfoController } from '~controllers/user.controller';
import useToggle from '~hooks/useToggle';
import useToggleMulti from '~hooks/useToggleMulti';
import Divider from '~ui/core/Divider';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import TextInput from '~ui/core/TextInput';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';
import useMobile from '~ui/styles/useMobile';

import BannerStatus from './BannerStatus';
import ProviderCards from './ProviderCards';

function Catalog() {
  const isMobile = useMobile();

  const {
    isServerLoggedIn,
  } = watchUserInfoController((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
  }));

  const [favorite, toggleFavorite] = useToggle();
  const [search, setSearch] = useState('');
  const [cardVariant, toggleCardVariant] = useToggleMulti([CardVariant.default, CardVariant.slim]);

  useQuery({
    queryFn: () => getAccountsController({ viewType: AccountViewType.public }),
    queryKey: queryKeys.slimAccounts(),
  });
  useQuery({
    queryFn: () => getAccountsController({ viewType: AccountViewType.private }),
    queryKey: queryKeys.userAccounts(),
    enabled: !!isServerLoggedIn,
  });

  return (
    <Stack py="xl" spacing="xl">
      <Stack>
        <BannerStatus />
        <Group position="center">
          {favorite ? (
            <Icon
              name="Star"
              button
              color="orange"
              onClick={() => toggleFavorite()}
            />
          ) : (
            <Icon
              name="Star"
              button
              onClick={() => toggleFavorite()}
            />
          )}
          <TextInput
            placeholder="Search"
            onChange={(event) => setSearch(event.target.value)}
          />
          {!isMobile && (
          <Icon
            name={cardVariant === CardVariant.slim ? 'Apps' : 'List'}
            button
            onClick={() => toggleCardVariant()}
          />
          )}
        </Group>
        <Text ta="center">Click on the card for more details</Text>
      </Stack>

      <Divider />
      <Stack align="center" id="nature-elements">
        <Title size="h2">
          Nature Elements
        </Title>
        <ContentSection>
          <Title size="h4" ta="center">
            These foundational and frontier strategies serve as the bedrock
            and vanguard for all subsequent strategies
          </Title>
        </ContentSection>
        <ProviderCards
          favorite={favorite}
          search={search}
          variant={cardVariant}
          category="nature-elements"
        />
      </Stack>

      <Divider />
      <Stack align="center" id="green-series">
        <Title size="h2">
          Giving Horizons
        </Title>
        <ContentSection>
          <Title size="h4" ta="center">
            These strategies focus on eco-friendly investments where profits
            are used to support environmentally-friendly initiatives,
            balancing good returns with sustainability for a greener future
          </Title>
        </ContentSection>
        <ProviderCards
          favorite={favorite}
          search={search}
          variant={cardVariant}
          category="green-series"
        />
      </Stack>
    </Stack>
  );
}

export default Catalog;
