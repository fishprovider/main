import accountAdd from '@fishprovider/cross/dist/api/accounts/add';
import { apiPost } from '@fishprovider/cross/dist/libs/api';
import storeUser from '@fishprovider/cross/dist/stores/user';
import { AccountPlatform, ProviderType } from '@fishprovider/utils/dist/constants/account';
import type { Config } from '@fishprovider/utils/dist/types/Account.model';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Link from '~components/base/Link';
import Routes, { toAccount } from '~libs/routes';
import Button from '~ui/core/Button';
import Icon from '~ui/core/Icon';
import Loading from '~ui/core/Loading';
import Stack from '~ui/core/Stack';
import Table from '~ui/core/Table';
import TextInput from '~ui/core/TextInput';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';
import { toastError, toastSuccess } from '~ui/toast';

interface AccountToImport {
  accountId: string;
  traderLogin: string,
  isLive: boolean;
  config: Config,
}

const getDefaultName = (traderLogin: string, isLive: boolean) => `${isLive ? 'Live' : 'Demo'}${traderLogin}`;

function ImportAccounts({ accounts }: { accounts: AccountToImport[] }) {
  const [names, setNames] = useState<Record<string, string>>({});
  const [providerIds, setProviderIds] = useState<Record<string, string>>({});

  const onImport = (id: string, name: string) => {
    const { config } = accounts.find(({ accountId }) => accountId === id) as AccountToImport;
    const accountToNew = {
      name,
      providerType: ProviderType.icmarkets, // TODO: check and warn if broker is different
      accountPlatform: AccountPlatform.ctrader,
      config,
    };
    accountAdd({ accountToNew }).then((account) => {
      setProviderIds((prev) => ({
        ...prev,
        [id]: account._id,
      }));
      toastSuccess('Done');
    }).catch((err) => {
      toastError(`${err}`);
    });
  };

  const rows = _.sortBy(accounts, 'traderLogin').map(({ accountId, traderLogin, isLive }) => ({
    id: accountId,
    number: traderLogin,
    name: names[accountId] || getDefaultName(traderLogin, isLive),
    providerId: providerIds[accountId],
  }));

  const renderRow = (row: { id: string; number: string; name: string, providerId?: string }) => {
    const {
      id, number, name, providerId,
    } = row;
    return (
      <Table.Row key={id}>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{number}</Table.Cell>
        <Table.Cell>
          <TextInput
            value={name}
            onChange={(event) => setNames((prev) => ({
              ...prev,
              [id]: event.target.value,
            }))}
          />
        </Table.Cell>
        <Table.Cell>
          {providerId ? (
            <Link href={toAccount(providerId)}>
              <Button>Trade Now ➜ 📈</Button>
            </Link>
          ) : (
            <Button onClick={() => onImport(id, name)} rightIcon={<Icon name="SystemUpdateAlt" />}>
              Import now
            </Button>
          )}
        </Table.Cell>
      </Table.Row>
    );
  };

  return (
    <Table>
      <Table.THead>
        <Table.Row>
          <Table.Header>ID</Table.Header>
          <Table.Header>Number</Table.Header>
          <Table.Header>Name</Table.Header>
          <Table.Header>Actions</Table.Header>
        </Table.Row>
      </Table.THead>
      <Table.TBody>
        {rows.map(renderRow)}
      </Table.TBody>
    </Table>
  );
}

function CTraderAuth() {
  const router = useRouter();
  const { code } = router.query;

  const isServerLoggedIn = storeUser.useStore((state) => state.isServerLoggedIn);

  const [accounts, setAccounts] = useState<AccountToImport[]>();

  useEffect(() => {
    if (isServerLoggedIn && code) {
      apiPost<AccountToImport[]>('/accounts/ctrader/getAccounts', {
        origin: window.location.origin,
        path: window.location.pathname,
        code,
      }).then((res) => {
        toastSuccess('Connected');
        setAccounts(res);
      }).catch((err) => {
        toastError(`Failed to connect: ${err}`);
        router.push(Routes.accounts);
      });
    }
  }, [router, isServerLoggedIn, code]);

  if (!accounts) return <Loading />;

  return (
    <ContentSection>
      <Stack py="xl">
        <Title>Import CTrader Accounts</Title>
        <ImportAccounts accounts={accounts} />
      </Stack>
    </ContentSection>
  );
}

export default CTraderAuth;
