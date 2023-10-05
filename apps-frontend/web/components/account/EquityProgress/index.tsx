import Group from '~ui/core/Group';

import BddProgress from './BddProgress';
import EddProgress from './EddProgress';
import TargetProgress from './TargetProgress';

interface Props {
  providerId: string,
  profit: number,
  slim?: boolean,
}

function EquityProgress({ providerId, profit, slim }: Props) {
  return (
    <Group spacing={0}>
      {slim ? null : <BddProgress providerId={providerId} profit={profit} />}
      {slim ? null : <EddProgress providerId={providerId} profit={profit} />}
      <TargetProgress providerId={providerId} profit={profit} slim />
    </Group>
  );
}

export default EquityProgress;
