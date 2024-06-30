/* eslint-disable no-undef */

db.getCollection('orders').deleteMany({
  createdAt: { $lt: new Date('2024 May 1') },
});
db.getCollection('signals').deleteMany({
  createdAt: { $lt: new Date('2024 May 1') },
});
