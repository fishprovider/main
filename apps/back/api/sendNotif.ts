import { push } from '@fishprovider/core/dist/libs/notif';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { User } from '@fishprovider/utils/dist/types/User.model';

const sendNotif = async ({ data, userInfo }: {
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

export default sendNotif;
