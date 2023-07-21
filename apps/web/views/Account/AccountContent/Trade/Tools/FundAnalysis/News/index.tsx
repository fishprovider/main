import { getNewsController, watchNewsController } from '@fishprovider/adapter-frontend';
import { getNewsUseCase, watchNewsUseCase } from '@fishprovider/application-rules';
import { OfflineFirstNewsRepository } from '@fishprovider/framework-offline-first';
import { StoreNewsRepository } from '@fishprovider/framework-store';
import type { News } from '@fishprovider/utils/dist/types/News.model';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import Button from '~ui/core/Button';
import Group from '~ui/core/Group';
import Stack from '~ui/core/Stack';
import Switch from '~ui/core/Switch';
import Table from '~ui/core/Table';
import Title from '~ui/core/Title';

const getNews = getNewsController(getNewsUseCase(OfflineFirstNewsRepository));
const watchNews = watchNewsController(watchNewsUseCase(StoreNewsRepository));

function NewsList() {
  const [type, setType] = useState('today'); // today, this, next
  const [showAll, setShowAll] = useState(false);

  const news = watchNews({
    selector: (state) => (type === 'today'
      ? _.filter(state, (item) => moment(item.datetime) >= moment()
          && moment(item.datetime) <= moment().add(1, 'day'))
      : _.filter(state, (item) => item.week === type)
    ),
  });

  useEffect(() => {
    getNews({
      week: type === 'next' ? 'next' : 'this',
    });
  }, [type]);

  const allRows = _.sortBy(
    showAll ? news : _.filter(news, (row) => ['high', 'medium'].includes(row.impact)),
    (row) => moment(row.datetime),
  );
  const forexRows = allRows.filter((item) => item.type === 'forex');
  const metalRows = allRows.filter((item) => item.type === 'metal');
  const energyRows = allRows.filter((item) => item.type === 'energy');

  const renderDate = (row: News) => (
    <Table.Cell>
      {moment(row.datetime).format('ddd MM/D HH:mm')}
    </Table.Cell>
  );

  const renderCurrency = (row: News) => {
    let icon = '';
    if (row.impact === 'high') icon = '🔴';
    if (row.impact === 'medium') icon = '🟠';
    if (row.impact === 'low') icon = '🟡';
    if (row.impact === 'holiday') icon = '⚪';
    return (
      <Table.Cell style={{ color: ['USD', 'All'].includes(row.currency) ? 'red' : 'inherit' }}>
        {`${icon} ${row.currency || ''}`}
      </Table.Cell>
    );
  };

  const renderRows = (rows: News[]) => (
    <Table>
      <Table.THead>
        <Table.Row>
          <Table.Header>Time</Table.Header>
          <Table.Header>$</Table.Header>
          <Table.Header>Title</Table.Header>
          <Table.Header>Forecast</Table.Header>
          <Table.Header>Previous</Table.Header>
        </Table.Row>
      </Table.THead>
      <Table.TBody>
        {!rows.length && (
          <Table.Row>
            <Table.Cell colSpan={6}>N.A.</Table.Cell>
          </Table.Row>
        )}
        {rows.map((row, index) => (
          <Table.Row
            key={index}
            style={{
              background: moment(row.datetime) < moment() ? 'grey' : 'inherit',
            }}
          >
            {renderDate(row)}
            {renderCurrency(row)}
            <Table.Cell>{row.title}</Table.Cell>
            <Table.Cell>{row.forecast}</Table.Cell>
            <Table.Cell>{row.previous}</Table.Cell>
          </Table.Row>
        ))}
      </Table.TBody>
    </Table>
  );

  return (
    <Stack>
      <Group>
        <Title size="h3">🗞️ News</Title>
        <Group spacing={0}>
          <Button
            onClick={() => setType('today')}
            variant={type === 'today' ? 'filled' : 'light'}
          >
            Next 24 hours
          </Button>
          <Button
            onClick={() => setType('this')}
            variant={type === 'this' ? 'filled' : 'light'}
          >
            This Week
          </Button>
          <Button
            onClick={() => setType('next')}
            variant={type === 'next' ? 'filled' : 'light'}
          >
            Next Week
          </Button>
        </Group>
        <Switch
          label="Show all"
          checked={showAll}
          onChange={() => setShowAll((prev) => !prev)}
        />
      </Group>
      <Stack>
        <Title size="h4">💱 Forex</Title>
        {renderRows(forexRows)}
      </Stack>
      <Stack>
        <Title size="h4">🔩 Metal</Title>
        {renderRows(metalRows)}
      </Stack>
      <Stack>
        <Title size="h4">⚡ Energy</Title>
        {renderRows(energyRows)}
      </Stack>
    </Stack>
  );
}

export default NewsList;
