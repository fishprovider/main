import accountGetManySlim from '@fishprovider/cross/dist/api/accounts/getManySlim';
import accountGetManyUser from '@fishprovider/cross/dist/api/accounts/getManyUser';
import { queryKeys } from '@fishprovider/cross/dist/constants/query';
import { useQuery } from '@fishprovider/cross/dist/libs/query';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { CardVariant } from '~constants/account';
import useToggle from '~hooks/useToggle';
import useToggleMulti from '~hooks/useToggleMulti';
import CopyButton from '~ui/core/CopyButton';
import Divider from '~ui/core/Divider';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import TextInput from '~ui/core/TextInput';
import Title from '~ui/core/Title';
import useMobile from '~ui/styles/useMobile';

import BannerStatus from './BannerStatus';
import ProviderCards from './ProviderCards';

function Catalog() {
  const router = useRouter();
  const isMobile = useMobile();

  const {
    isServerLoggedIn,
  } = storeUser.useStore((state) => ({
    isServerLoggedIn: state.isServerLoggedIn,
  }));

  const [favorite, toggleFavorite] = useToggle();
  const [search, setSearch] = useState('');
  const [cardVariant, toggleCardVariant] = useToggleMulti([CardVariant.default, CardVariant.slim]);

  useQuery({
    queryFn: accountGetManySlim,
    queryKey: queryKeys.slimAccounts(),
  });
  useQuery({
    queryFn: accountGetManyUser,
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
        <CopyButton href={`https://www.fishprovider.com${router.pathname}#nature-elements`}>
          <Title size="h2">
            Nature Elements
          </Title>
        </CopyButton>
        <ProviderCards
          favorite={favorite}
          search={search}
          variant={cardVariant}
          category="nature-elements"
        />
      </Stack>

      <Divider />
      <Stack align="center" id="ocean-series">
        <CopyButton href={`https://www.fishprovider.com${router.pathname}#ocean-series`}>
          <Title size="h2">
            Ocean Series
          </Title>
        </CopyButton>
        <ProviderCards
          favorite={favorite}
          search={search}
          variant={cardVariant}
          category="ocean-series"
        />
      </Stack>
    </Stack>
  );
}

export default Catalog;
