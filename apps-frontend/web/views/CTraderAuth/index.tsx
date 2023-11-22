import {
  Account, AccountPlatform, AccountTradeType, AccountType,
} from '@fishprovider/core';
import storeUser from '@fishprovider/cross/dist/stores/user';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Link from '~components/base/Link';
import Routes, { toAccount } from '~libs/routes';
import { addAccountService } from '~services/account/addAccount.service';
import { getTradeAccountsService } from '~services/account/getTradeAccounts.service';
import Button from '~ui/core/Button';
import Icon from '~ui/core/Icon';
import Loading from '~ui/core/Loading';
import Stack from '~ui/core/Stack';
import Table from '~ui/core/Table';
import TextInput from '~ui/core/TextInput';
import Title from '~ui/core/Title';
import ContentSection from '~ui/layouts/ContentSection';
import { toastError, toastSuccess } from '~ui/toast';

const getDefaultName = (tradeAccountNumber?: string, isLive?: boolean) => `${isLive ? 'Live' : 'Demo'}${tradeAccountNumber}`;

function ImportAccounts({ accounts }: { accounts: Partial<Account>[] }) {
  const [names, setNames] = useState<Record<string, string>>({});
  const [tradeAccountIds, setTradeAccountIds] = useState<Record<string, string>>({});

  const onImport = (tradeAccountId: string, name: string) => {
    const account = accounts.find(({ config }) => config?.accountId === tradeAccountId);
    if (!account?.config) {
      toastError('Account not found');
      return;
    }
    addAccountService({
      name,
      accountType: AccountType.icmarkets,
      accountPlatform: AccountPlatform.ctrader,
      accountTradeType: account?.config?.isLive ? AccountTradeType.live : AccountTradeType.demo,
      baseConfig: account.config,
    }).then((item) => {
      const accountId = item?._id;
      if (!accountId) {
        toastError('Failed to add account');
        return;
      }
      setTradeAccountIds((prev) => ({
        ...prev,
        [tradeAccountId]: accountId,
      }));
      toastSuccess('Done');
    }).catch((err) => {
      toastError(`${err}`);
    });
  };

  const rows = _.sortBy(accounts, (account) => account.config?.accountNumber)
    .map(({ config }) => {
      const { accountId: tradeAccountId = '', accountNumber: tradeAccountNumber = '', isLive } = config || {};
      return {
        tradeAccountId,
        tradeAccountNumber,
        name: names[tradeAccountId] || getDefaultName(tradeAccountNumber, isLive),
        accountId: tradeAccountIds[tradeAccountId],
      };
    });

  const renderRow = (row: {
    tradeAccountId: string,
    tradeAccountNumber: string,
    name: string,
    accountId?: string,
  }) => {
    const {
      tradeAccountId, tradeAccountNumber, name, accountId,
    } = row;
    return (
      <Table.Row key={tradeAccountId}>
        <Table.Cell>{tradeAccountId}</Table.Cell>
        <Table.Cell>{tradeAccountNumber}</Table.Cell>
        <Table.Cell>
          <TextInput
            value={name}
            onChange={(event) => setNames((prev) => ({
              ...prev,
              [tradeAccountId]: event.target.value,
            }))}
          />
        </Table.Cell>
        <Table.Cell>
          {accountId ? (
            <Link href={toAccount(accountId)}>
              <Button color="green">Trade Now ➜ 📈</Button>
            </Link>
          ) : (
            <Button onClick={() => onImport(tradeAccountId, name)} rightIcon={<Icon name="SystemUpdateAlt" />}>
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

  const [accounts, setAccounts] = useState<Partial<Account>[]>();

  useEffect(() => {
    if (isServerLoggedIn && code) {
      const [_1, _2, _3, clientId] = window.location.pathname.split('/');
      const redirectUrl = `${window.location.origin}${window.location.pathname}`;

      getTradeAccountsService({
        accountPlatform: AccountPlatform.ctrader,
        baseConfig: {
          clientId,
        },
        tradeRequest: {
          redirectUrl,
          code: code as string,
        },
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
