import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import type { User } from '@fishprovider/utils/dist/types/User.model';

const statGetMany = async ({ data, userInfo }: {
  data: {
    type: string,
    typeData: any
  }
  userInfo: User,
}) => {
  const { type, typeData } = data;
  if (!type) {
    return { error: ErrorType.badRequest };
  }

  const { uid } = userInfo;
  if (!uid) {
    return { error: ErrorType.accessDenied };
  }

  if (type === 'dailyFunding') {
    typeData.date.$gte = new Date(typeData.date.$gte);
  }

  const docs = await Mongo.collection('stats')
    .find({ ...typeData, type }).toArray();

  if (type === 'dailyFunding') {
    const maskedStats = docs.map((item) => ({
      ...item,
      author: item.author && `${item.author.substring(0, item.author.length / 2)}...`,
    }));
    return { result: maskedStats };
  }

  return { result: docs };
};

export default statGetMany;
