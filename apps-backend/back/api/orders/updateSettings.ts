import { push } from '@fishprovider/old-core/dist/libs/notif';
import { ErrorType } from '@fishprovider/utils/dist/constants/error';
import { getRoleProvider } from '@fishprovider/utils/dist/helpers/user';
import type { Order } from '@fishprovider/utils/dist/types/Order.model';
import type { User } from '@fishprovider/utils/dist/types/User.model';
import { ReturnDocument } from 'mongodb';

const orderUpdateSettings = async ({ data, userInfo }: {
  data: {
    providerId: string,
    orderId: string,
    alarm?: boolean,
    reborn?: boolean,
    confidence?: number,
    lock?: boolean,
    hide?: boolean,
    chat?: string,
    chatType?: string,
  },
  userInfo: User,
}) => {
  const {
    providerId, orderId, alarm, reborn, confidence, lock, hide, chat, chatType,
  } = data;
  if (!providerId || !orderId
    || !(alarm !== undefined || reborn !== undefined
        || confidence !== undefined || lock || hide || chat
    )
  ) {
    return { error: ErrorType.badRequest };
  }

  const {
    isTraderAccount, isProtectorAccount, isViewerAccount,
  } = getRoleProvider(userInfo.roles, providerId);
  if (!isViewerAccount) {
    return { error: ErrorType.accessDenied };
  }

  const value = await Mongo.collection<Order>('orders').findOneAndUpdate(
    {
      _id: orderId,
    },
    {
      ...(chat && {
        $push: {
          chats: {
            message: chat,
            chatType,
            userId: userInfo._id,
            userName: userInfo.name,
            userPicture: userInfo.picture,
            createdAt: new Date(),
          },
        },
      }),
      $set: {
        ...((isTraderAccount || isProtectorAccount) && {
          ...(alarm !== undefined && { alarm }),
          ...(reborn !== undefined && { reborn }),
          ...(lock && { lock }),
          ...(hide && { hide }),
        }),
        ...(confidence !== undefined && {
          [`confidences.${userInfo._id}`]: confidence,
        }),
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: ReturnDocument.AFTER,
      projection: {
        ...(alarm !== undefined && { alarm: 1 }),
        ...(reborn !== undefined && { reborn: 1 }),
        ...(confidence !== undefined && { confidences: 1 }),
        ...(lock && { lock: 1 }),
        ...(hide && { hide: 1 }),
        ...(chat && { chats: 1 }),
        updatedAt: 1,
      },
    },
  );

  if (alarm) {
    push(
      { title: 'Alarm', body: `Discuss now! Order ${orderId}` },
      `account-${providerId}`,
    );
  }

  return { result: value };
};

export default orderUpdateSettings;
