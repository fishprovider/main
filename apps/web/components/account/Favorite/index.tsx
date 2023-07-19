import updateUser from '@fishprovider/cross/dist/api/users/updateUser';
import storeUser from '@fishprovider/cross/dist/stores/user';

import Icon from '~ui/core/Icon';

interface Props {
  providerId: string,
}

function Favorite({ providerId }: Props) {
  const star = storeUser.useStore((state) => state.info?.starProviders?.[providerId]);

  const onStar = () => {
    const user = storeUser.getState().info;
    const starProviders = {
      ...user?.starProviders,
      [providerId]: !user?.starProviders?.[providerId],
    };
    updateUser({ starProviders });
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
