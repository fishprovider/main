import storePrices from '@fishprovider/cross/stores/prices';
import type { ProviderType } from '@fishprovider/utils/constants/account';
import { getLotFromVolume, getVolumeFromLot } from '@fishprovider/utils/helpers/price';
import { useEffect, useState } from 'react';

import Group from '~ui/core/Group';
import NumberInput from '~ui/core/NumberInput';

interface Props {
  providerType: ProviderType,
  symbol: string,
  volume: number,
  onChange: (volume: number) => void,
}

function VolumeLots({
  providerType, symbol, volume: volumeProp, onChange,
}: Props) {
  const priceDoc = storePrices.useStore((prices) => prices[`${providerType}-${symbol}`]);

  const [volumeInput, setVolumeInput] = useState<number | string>();
  const [lotInput, setLotInput] = useState<number | string>();

  useEffect(() => {
    setVolumeInput(undefined);
    setLotInput(undefined);
  }, [symbol]);

  if (!priceDoc) return null;

  const volume = volumeInput ?? volumeProp;
  const lot = lotInput ?? getLotFromVolume({
    providerType,
    symbol,
    prices: { [priceDoc._id]: priceDoc },
    volume: +volume,
  }).lot;

  return (
    <Group>
      <NumberInput
        label="Volume"
        value={volume}
        onChange={(value) => {
          setVolumeInput(value);
          onChange(+value);

          const newLot = getLotFromVolume({
            providerType,
            symbol,
            prices: { [priceDoc._id]: priceDoc },
            volume: +value,
          }).lot;
          setLotInput(newLot);
        }}
        min={0}
        error={(() => {
          if (!volume) return 'Cannot be empty';
          if (+volume <= 0) return 'Must be > 0';
          return undefined;
        })()}
      />
      <NumberInput
        label="Lots"
        step={0.01}
        value={lot}
        onChange={(value) => {
          setLotInput(value);

          const newVolume = getVolumeFromLot({
            providerType,
            symbol,
            prices: { [priceDoc._id]: priceDoc },
            lot: +value,
          }).volume || 0;
          setVolumeInput(newVolume);
          onChange(newVolume);
        }}
        min={0}
        error={(() => {
          if (!lot) return 'Cannot be empty';
          if (+lot <= 0) return 'Must be > 0';
          return undefined;
        })()}
      />
    </Group>
  );
}

export default VolumeLots;
