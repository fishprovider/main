import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { Stat } from '@fishprovider/utils/dist/types/Stat.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';

const statUpdate = async ({ data, userInfo }: {
  data: {
    docId: string,
    doc: any,
  }
  userInfo: User,
}) => {
  const { docId, doc } = data;
  if (!docId) {
    return { error: ErrorType.badRequest };
  }

  const { isManagerWeb } = getRoleProvider(userInfo.roles);
  if (!isManagerWeb) {
    return { error: ErrorType.accessDenied };
  }

  const newDoc = {
    ...doc,
    _id: docId,
    updatedAt: new Date(),
  };

  await Mongo.collection<Stat>('stats').updateOne(
    { _id: docId },
    { $set: newDoc },
    { upsert: true },
  );

  return { result: newDoc };
};

export default statUpdate;
