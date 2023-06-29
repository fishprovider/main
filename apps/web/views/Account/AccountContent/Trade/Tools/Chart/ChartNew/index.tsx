import Icon from '~ui/core/Icon';
import openModal from '~ui/modals/openModal';

import ChartFull from './ChartFull';
import ChartTech from './ChartTech';

function Chart() {
  const onFullscreen = () => openModal({
    title: 'Fullscreen',
    content: <ChartFull />,
  });

  return (
    <ChartTech
      fullscreenAction={(
        <Icon name="Fullscreen" button onClick={onFullscreen} tooltip="Fullscreen" />
      )}
    />
  );
}

export default Chart;
