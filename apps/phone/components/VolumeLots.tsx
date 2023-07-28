import storePrices from '@fishprovider/cross/dist/stores/prices';
import type { ProviderType } from '@fishprovider/utils/dist/constants/account';
import { getLotFromVolume, getVolumeFromLot } from '@fishprovider/utils/dist/helpers/price';
import { useEffect, useState } from 'react';

import Group from '~ui/Group';
import Input from '~ui/Input';
import Label from '~ui/Label';
import Stack from '~ui/Stack';

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
      <Stack space="$0" flex={1}>
        <Label htmlFor="volume">Volume</Label>
        <Input
          id="volume"
          value={String(volume)}
          onChangeText={(value) => {
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
      </Stack>
      <Stack space="$0" flex={1}>
        <Label htmlFor="lot">Lot</Label>
        <Input
          id="lot"
          value={String(lot)}
          onChangeText={(value) => {
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
      </Stack>
    </Group>
  );
}

export default VolumeLots;
