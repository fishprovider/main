import { push } from '@fishbot/core/libs/firebase';
import { ErrorType } from '@fishbot/utils/constants/error';
import { getRoleProvider } from '@fishbot/utils/helpers/user';
import type { User } from '@fishbot/utils/types/User.model';

const pushNotif = async ({ data, userInfo }: {
  data: {
    title: string,
    body: string,
  }
  userInfo: User,
}) => {
  const { title, body } = data;
  if (!title || !body) {
    return { error: ErrorType.badRequest };
  }

  const { isAdmin } = getRoleProvider(userInfo.roles);
  if (!isAdmin) {
    return { error: ErrorType.accessDenied };
  }

  await push({
    title,
    body,
  });

  return {};
};

export default pushNotif;
