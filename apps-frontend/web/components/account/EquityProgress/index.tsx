import Group from '~ui/core/Group';

import BddProgress from './BddProgress';
import EddProgress from './EddProgress';
import TargetProgress from './TargetProgress';

interface Props {
  providerId: string,
  profit: number,
}

function EquityProgress({ providerId, profit }: Props) {
  return (
    <Group spacing={0}>
      <BddProgress providerId={providerId} profit={profit} />
      <EddProgress providerId={providerId} profit={profit} />
      <TargetProgress providerId={providerId} profit={profit} />
    </Group>
  );
}

export default EquityProgress;
