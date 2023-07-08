import { handleEvent, verifyEvent } from '@fishprovider/coin/libs/coinbaseCommerce';

const paymentEventHandler = (
  paymentEventType: any, // TODO: define type
  payload: any,
) => {
  console.log('TODO', paymentEventType, payload);
  Logger.warn('TODO', paymentEventType, payload);
};

const coinbaseCommerce = async (payload: any, headers: any) => {
  await verifyEvent(payload, headers);
  await handleEvent(payload, paymentEventHandler);
  return { result: 'Done' };
};

export default coinbaseCommerce;
