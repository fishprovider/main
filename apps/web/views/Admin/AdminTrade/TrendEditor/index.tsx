import statsGetManyTrends from '@fishbot/cross/api/stats/getManyTrends';
import statsUpdate from '@fishbot/cross/api/stats/update';
import storeStats from '@fishbot/cross/stores/stats';
import storeUser from '@fishbot/cross/stores/user';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import Select from '~ui/core/Select';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import Title from '~ui/core/Title';
import openConfirmModal from '~ui/modals/openConfirmModal';

function TrendEditor() {
  const {
    symbol,
  } = storeUser.useStore((state) => ({
    symbol: state.activeSymbol,
  }));

  const trend = storeStats.useStore((state) => _.find(
    state,
    (item) => item.type === 'trends' && item.symbol === symbol,
  ));

  const [editor, setEditor] = useState<Record<string, string>>({});

  useEffect(() => {
    if (symbol) {
      statsGetManyTrends({ symbol });
    }
  }, [symbol]);

  const onSave = async () => {
    if (!(await openConfirmModal())) return;

    const docId = trend?._id || `trends-${symbol}`;
    await statsUpdate({
      docId,
      doc: {
        _id: docId,
        type: 'trends',
        typeId: symbol,
        symbol,
        ...trend,
        ...editor,
      },
    });
  };

  const renderTrend = (timeFr: string) => {
    const trendTimeFr = editor[timeFr] || trend?.[timeFr];
    return (
      <Group key={timeFr}>
        <Text>{_.upperFirst(timeFr)}</Text>
        <Select
          data={['Up', 'Down', 'Sideway']}
          value={trendTimeFr}
          onChange={(value) => {
            if (!value) return;
            setEditor((prev) => ({
              ...prev,
              [timeFr]: value,
            }));
          }}
        />
      </Group>
    );
  };

  return (
    <Stack>
      <Group>
        <Title size="h3">📈 Trend</Title>
        <Icon name="Save" button onClick={onSave} tooltip="Save" />
        <Icon name="RestartAlt" button onClick={() => setEditor({})} tooltip="Reset" />
      </Group>
      <Stack spacing="xs">
        {['h1', 'h4', 'd1'].map(renderTrend)}
      </Stack>
    </Stack>
  );
}

export default TrendEditor;
