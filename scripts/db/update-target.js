/* eslint-disable no-undef */

db.accounts.find({
  _id: {
    $in: [
      'earth',
      'water',
      'shark',
      'greenhill',
      'blockchaindream',
      'exness',
      'robo',
    ],
  },
}).sort({
  order: -1,
}).map((doc) => {
  const offset = 0.1;
  const monthProfit = +doc.monthProfit + offset;
  const monthTargetLock = Math.round((doc.balance + (doc.balance * monthProfit) / 100) * 100) / 100;
  const copyVolumeRatioFixed = Math.max(1, Math.round((doc.balance / 1000) * 100) / 100);

  db.accounts.updateOne({
    _id: doc._id,
    'plan.type': 'monthTargetLock',
  }, {
    $set: {
      balanceStart: doc.balance,
      balanceStartMonth: doc.balance,
      'plan.$.value': monthTargetLock,
      'settings.parents.master.copyVolumeRatioFixed': copyVolumeRatioFixed,
    },
  });

  return {
    balanceStart: doc.balance,
    balanceStartMonth: doc.balance,
    monthProfit,
    monthTargetLock,
    copyVolumeRatioFixed,
  };
});
