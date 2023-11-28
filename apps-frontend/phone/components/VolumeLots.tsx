import type { ProviderType } from '@fishprovider/core';
import storePrices from '@fishprovider/cross/dist/stores/prices';
import { getLotFromVolume, getVolumeFromLot } from '@fishprovider/utils/dist/helpers/price';
import { useEffect, useState } from 'react';

import Group from '~ui/Group';
import Input from '~ui/Input';

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
      <Input
        id="volume"
        label="Volume"
        value={String(volume)}
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
      />
      <Input
        id="lot"
        label="Lot"
        value={String(lot)}
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
      />
    </Group>
  );
}

export default VolumeLots;
