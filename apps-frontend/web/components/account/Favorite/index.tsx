import updateUser from '@fishprovider/cross/dist/api/user/updateUser';
import storeUser from '@fishprovider/cross/dist/stores/user';

import Icon from '~ui/core/Icon';

interface Props {
  providerId: string,
}

function Favorite({ providerId: accountId }: Props) {
  const star = storeUser.useStore((state) => state.info?.starProviders?.[accountId]);

  const onStar = () => {
    const user = storeUser.getState().info;
    updateUser({
      filter: {},
      payload: {
        starProvider: {
          accountId,
          enabled: !user?.starProviders?.[accountId],
        },
      },
      options: {
        projection: {
          _id: 1,
          starProviders: 1,
        },
      },
    });
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
