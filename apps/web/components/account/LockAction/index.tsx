import Icon from '~ui/core/Icon';
import Title from '~ui/core/Title';
import openModal from '~ui/modals/openModal';

import LockModal from './LockModal';

interface Props {
  providerId: string,
  userId?: string,
}

function LockAction({ providerId, userId }: Props) {
  const onLock = () => openModal({
    title: <Title size="h4">Lock Account</Title>,
    content: <LockModal providerId={providerId} userId={userId} />,
  });

  return (
    <span>
      <Icon
        name="LockOpen"
        size="small"
        button
        onClick={onLock}
        tooltip="Lock?"
      />
    </span>
  );
}

export default LockAction;
