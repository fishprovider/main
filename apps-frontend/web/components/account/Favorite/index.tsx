import storeUser from '@fishprovider/cross/dist/stores/user';

import { updateUserController } from '~controllers/user.controller';
import Icon from '~ui/core/Icon';

interface Props {
  providerId: string,
}

function Favorite({ providerId: accountId }: Props) {
  const star = storeUser.useStore((state) => state.info?.starProviders?.[accountId]);

  const onStar = () => {
    const user = storeUser.getState().info;
    updateUserController(
      {
        email: user?.email,
      },
      {
        starAccount: {
          accountId,
          enabled: !user?.starProviders?.[accountId],
        },
      },
    );
  };

  return (
    <Icon
      name={star ? 'Star' : 'StarOutline'}
      color={star ? 'orange' : undefined}
      size="small"
      button
      onClick={onStar}
      tooltip="Set Favorite"
    />
  );
}

export default Favorite;
