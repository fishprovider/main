import type { Transaction } from '@fishbot/utils/types/Pay.model';
import type { ClientSession } from 'mongodb';

const updateTransaction = async (params: {
  transaction: Transaction,
  updateData: Partial<Transaction>,
  unsetFields?: string[],
  session?: ClientSession,
}) => {
  const {
    transaction, updateData, unsetFields, session,
  } = params;
  const { _id: payId } = transaction;

  const updateDataToSet = {
    ...updateData,
    updatedAt: new Date(),
  };

  await Mongo.collection<Transaction>('transactions').updateOne({
    _id: payId,
  }, {
    $set: updateDataToSet,
    $push: {
      updatedLogs: transaction,
    },
    ...(unsetFields && {
      $unset: unsetFields.reduce((acc, field) => ({
        ...acc,
        [field]: '',
      }), {}),
    }),
  }, {
    session,
  });

  return {
    ...transaction,
    ...updateDataToSet,
  };
};

export default updateTransaction;
