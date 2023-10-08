import moment from 'moment-timezone';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { cacheRead, cacheWrite } from '~libs/cache';
import Select from '~ui/core/Select';

const zones = moment.tz
  .names()
  .filter(
    (item) => item.startsWith('Etc/GMT') && !['Etc/GMT', 'Etc/GMT0', 'Etc/GMT-0'].includes(item),
  )
  .map((item) => item.substring(7))
  .sort((a, b) => a.localeCompare(b));

function TimezoneSelector() {
  const router = useRouter();

  const [timezone, setTimezone] = useState('');

  useEffect(() => {
    cacheRead<string>('timezone').then((cacheTimezone) => {
      setTimezone(cacheTimezone || moment.tz.guess(true));
    });
  }, []);

  const zoneCur = moment
    .tz(timezone)
    .format('ZZ')
    .substring(0, 3)
    .replace('+0', '+')
    .replace('-0', '-');

  return (
    <Select
      defaultValue={zoneCur}
      onChange={async (value) => {
        if (!value) return;
        let newZone = value;
        if (newZone[0] === '-') newZone = newZone.replace('-', '+');
        if (newZone[0] === '+') newZone = newZone.replace('+', '-');
        newZone = `Etc/GMT${newZone}`;
        await cacheWrite('timezone', timezone);
        router.reload();
      }}
      data={zones.map((zone) => ({
        value: zone,
        label: `UTC${zone}`,
      }))}
      size="xs"
      w={110}
    />
  );
}

export default TimezoneSelector;
