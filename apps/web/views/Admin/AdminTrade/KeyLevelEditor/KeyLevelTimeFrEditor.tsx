import statsUpdate from '@fishbot/cross/api/stats/update';
import storeStats from '@fishbot/cross/stores/stats';
import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';

import Group from '~ui/core/Group';
import Icon from '~ui/core/Icon';
import NumberInput from '~ui/core/NumberInput';
import Stack from '~ui/core/Stack';
import Text from '~ui/core/Text';
import openConfirmModal from '~ui/modals/openConfirmModal';

interface Props {
  symbol: string;
  timeFr: string;
}

function KeyLevelTimeFrEditor({ symbol, timeFr }: Props) {
  const srTimeFr = storeStats.useStore((state) => _.find(
    state,
    (item) => item.type === 'keyLevels' && item.symbol === symbol && item.timeFr === timeFr,
  ));

  const [editor, setEditor] = useState<(number | string)[]>([]);

  const color = timeFr === 'Daily' ? 'red' : 'orange';
  const keyLevels = _.orderBy(
    _.concat<number | ''>(
      srTimeFr?.keyLevels || [],
      _.fill(Array(10 - (srTimeFr?.keyLevels?.length || 0)), ''),
    ),
    (item) => item,
    'desc',
  );

  const onSave = async () => {
    if (!(await openConfirmModal())) return;

    const docId = `keyLevels-${timeFr}-${symbol}`;
    const newKeyLevels = _.orderBy(
      _.compact(keyLevels.map((keyLevel, index) => editor[index] ?? keyLevel)),
      (item) => item,
      'desc',
    );
    await statsUpdate({
      docId,
      doc: {
        _id: docId,
        type: 'keyLevels',
        typeId: `${timeFr}-${symbol}`,
        timeFr,
        symbol,
        keyLevels: newKeyLevels.map((item) => +item),
      },
    });
  };

  const renderKeyLevels = () => (
    <Stack spacing="xs">
      <Text fz="xs" fs="italic">
        {`Updated ${moment(srTimeFr?.updatedAt).fromNow()}`}
      </Text>
      {_.map(keyLevels, (keyLevel, index) => (
        <NumberInput
          key={index}
          value={editor[index] ?? keyLevel}
          onChange={(value) => {
            setEditor((prev) => {
              const newEditor = [...prev];
              newEditor[index] = value;
              return newEditor;
            });
          }}
        />
      ))}
    </Stack>
  );

  return (
    <Stack>
      <Group>
        <Text color={color}>{timeFr}</Text>
        <Icon name="Save" button onClick={onSave} tooltip="Save" />
        <Icon name="RestartAlt" button onClick={() => setEditor([])} tooltip="Reset" />
      </Group>
      {renderKeyLevels()}
    </Stack>
  );
}

export default KeyLevelTimeFrEditor;
