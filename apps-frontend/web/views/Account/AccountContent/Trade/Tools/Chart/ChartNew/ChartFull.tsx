import Button from '~ui/core/Button';

import ChartTech from './ChartTech';

interface Props {
  onClose?: () => void;
}

function ChartFull({ onClose }: Props) {
  return (
    <>
      <ChartTech />
      <Button onClick={onClose}>Close</Button>
    </>
  );
}

export default ChartFull;
