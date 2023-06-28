import { send } from './notif';

test('Send notif', async () => {
  await send('@here test', ['detail1', 'detail2']);
});
