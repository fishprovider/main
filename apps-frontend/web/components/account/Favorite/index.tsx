import { getUserInfoController, updateUserController, watchUserInfoController } from '~controllers/user.controller';
import Icon from '~ui/core/Icon';

interface Props {
  providerId: string,
}

function Favorite({ providerId: accountId }: Props) {
  const isStar = watchUserInfoController((state) => state.activeUser?.starAccounts?.[accountId]);

  const onStar = () => {
    const user = getUserInfoController().activeUser;
    updateUserController(
      {
        email: user?.email,
      },
      {
        starAccount: {
          accountId,
          enabled: !user?.starAccounts?.[accountId],
        },
      },
    );
  };

  return (
    <Icon
      name={isStar ? 'Star' : 'StarOutline'}
      color={isStar ? 'orange' : undefined}
      size="small"
      button
      onClick={onStar}
      tooltip="Set Favorite"
    />
  );
}

export default Favorite;
