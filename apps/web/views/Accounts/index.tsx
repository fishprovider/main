import { ProviderTradeType } from '@fishbot/utils/constants/account';
import { Roles } from '@fishbot/utils/constants/user';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { sessionRead, sessionWrite } from '~libs/cache';
import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Indicator from '~ui/core/Indicator';
import Menu from '~ui/core/Menu';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import TextInput from '~ui/core/TextInput';
import ContentSection from '~ui/layouts/ContentSection';
import { isLive } from '~utils';

const AccountsFetch = dynamic(() => import('./AccountsFetch'));
const TradeCards = dynamic(() => import('./TradeCards'));

const filterItems = [
  { key: `role-${Roles.admin}`, label: 'Role Admin' },
  { key: `role-${Roles.trader}`, label: 'Role Trader' },
  { key: `role-${Roles.protector}`, label: 'Role Protector' },
  { key: `role-${Roles.viewer}`, label: 'Role Viewer' },
  { key: 'locked', label: 'Locked' },
  { key: 'nolock', label: 'No Lock' },
];

const sortItems = [
  { key: 'lastSeen', label: 'Last Seen' },
  { key: 'lastActive', label: 'Last Active' },
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
];

function Accounts() {
  const [favorite, setFavorite] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [filterBy, setFilterBy] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(sortItems[0]?.key);

  useEffect(() => {
    sessionRead<string>('option-favorite').then((val) => val && setFavorite(val === 'true'));
    sessionRead<string[]>('option-filterBy-list').then((val) => val && setFilterBy(val));
    sessionRead<string>('option-sortBy').then((val) => val && setSortBy(val));
  }, []);

  const filterMenuItems = [
    {
      key: 'filter',
      label: 'Filter by',
    },
    {
      key: 'clear',
      content: <Text size="xs">❌ Clear</Text>,
      onClick: () => {
        setFilterBy([]);
        sessionWrite('option-filterBy-list', []);
      },
    },
    ...filterItems.map(({ key, label }) => ({
      key,
      content: <Text color={filterBy.includes(key) ? 'green' : undefined}>{label}</Text>,
      onClick: () => {
        setFilterBy((prev) => {
          const newKeys = prev.includes(key)
            ? prev.filter((item) => item !== key)
            : [...prev, key];
          sessionWrite('option-filterBy-list', newKeys);
          return newKeys;
        });
      },
    })),
  ];

  const sortMenuItems = [
    {
      key: 'sort',
      label: 'Sort by',
    },
    ...sortItems.map(({ key, label }, index) => ({
      key,
      content: <Text color={sortBy === key ? 'green' : undefined}>{`${index + 1}. ${label}`}</Text>,
      onClick: () => {
        setSortBy(key);
        sessionWrite('option-sortBy', key);
      },
    })),
  ];

  const renderToolbar = () => (
    <Group position="center">
      {favorite ? (
        <Icon
          name="Star"
          button
          color="orange"
          onClick={() => {
            setFavorite(false);
            sessionWrite('option-favorite', 'false');
          }}
        />
      ) : (
        <Icon
          name="Star"
          button
          onClick={() => {
            setFavorite(true);
            sessionWrite('option-favorite', 'true');
          }}
        />
      )}
      <TextInput
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Menu items={filterMenuItems} closeOnItemClick={false}>
        <Indicator label={filterBy.length} size={16}>
          <Icon name="FilterAlt" button />
        </Indicator>
      </Menu>
      <Menu items={sortMenuItems} closeOnItemClick={false}>
        <Indicator label={sortItems.findIndex((item) => item.key === sortBy) + 1} size={16}>
          <Icon name="Sort" button />
        </Indicator>
      </Menu>
    </Group>
  );

  return (
    <>
      <AccountsFetch />
      <ContentSection>
        <Stack py="xl">
          {renderToolbar()}
          <TradeCards
            providerTradeType={isLive ? ProviderTradeType.live : ProviderTradeType.demo}
            favorite={favorite}
            search={search}
            filterBy={filterBy}
            sortBy={sortBy}
          />
        </Stack>
      </ContentSection>
    </>
  );
}

export default Accounts;
