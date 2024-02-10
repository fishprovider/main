/* eslint-disable no-undef */

db.accounts.find({
  _id: {
    $in: [
      'earth',
      'water',
      'air',
      'fire',
      'whale',
      'shark',
      'greenhill',
      'blockchaindream',
    ],
  },
}).sort({
  order: -1,
}).map((doc) => {
  const offset = 0.1;
  const monthProfit = +doc.monthProfit + offset;
  const monthTargetLock = doc.balance + (doc.balance * monthProfit) / 100;
  const copyVolumeRatioFixed = doc.balance / 1000;

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
