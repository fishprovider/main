import userUpdateInfo from '@fishprovider/cross/api/users/updateInfo';
import storeUser from '@fishprovider/cross/stores/user';

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
    userUpdateInfo({ starProviders });
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
