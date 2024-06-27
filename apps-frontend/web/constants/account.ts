import {
  AccountCopyVolumeMode, AccountLockType, AccountRole,
  AccountTradeType, AccountViewType,
  ProviderType,
} from '@fishprovider/core';

import { isLive } from '~utils';

export const TopAccounts = isLive ? [
  {
    _id: 'earth',
    icon: '🍀',
    ctraderUrl: 'https://ct.spotware.com/copy/strategy/65916',
    myFxBookUrl: 'https://www.myfxbook.com/members/FishProvider/earth/10192142',
  },
  {
    _id: 'water',
    icon: '🌊',
    ctraderUrl: 'https://ct.spotware.com/copy/strategy/65917',
    myFxBookUrl: 'https://www.myfxbook.com/members/FishProvider/water/10406062',
  },
] : [
  {
    _id: 'octopus',
  },
  {
    _id: 'oyster',
  },
  {
    _id: 'nemo',
  },
  {
    _id: 'dory',
  },
  {
    _id: 'seal',
  },
  {
    _id: 'exne',
  },
  {
    _id: 'robo',
  },
];

enum CardVariant {
  default = 'default',
  big = 'big',
  slim = 'slim',
}

const ctraderPlatforms = {
  icmarkets: {
    name: 'ICMarkets',
    icon: '/icons/icmarkets.svg',
    href: 'https://www.icmarkets.com',
    partnerUrl: 'https://icmarkets.com/?camp=71072',
    copyUrl: 'https://ct.icmarkets.com/copy/strategy',
    rank: 19,
  },
  litefinance: {
    name: 'LiteFinance',
    icon: '/icons/litefinance.png',
    href: 'https://www.litefinance.org',
    partnerUrl: 'https://litefinance.vn/?uid=847322350',
    copyUrl: 'https://app.litefinance.org/copy/strategy',
    rank: 27,
  },
  fpmarkets: {
    name: 'FPMarkets',
    icon: '/icons/fpmarkets.png',
    href: 'https://www.fpmarkets.com',
    partnerUrl: 'https://www.fpmarkets.com/?redir=stv&fpm-affiliate-utm-source=IB&fpm-affiliate-agt=22506',
    copyUrl: 'https://app.fpmarkets.com/copy/strategy',
    rank: 49,
  },
  fusionmarkets: {
    name: 'Fusion Markets',
    icon: '/icons/fusion.jpeg',
    href: 'https://www.fusionmarkets.com',
    partnerUrl: '',
    copyUrl: 'https://app.fusionmarkets.com/copy/strategy',
    rank: 126,
  },
  skilling: {
    name: 'Skilling',
    icon: '/icons/skilling.jpg',
    href: 'https://www.skilling.com',
    partnerUrl: 'https://go.skillingpartners.com/visit/?bta=35949&brand=skilling',
    copyUrl: 'https://ct.skilling.com/copy/strategy',
    rank: 208,
  },
  primus: {
    name: 'Primus',
    icon: '/icons/primus.png',
    href: 'https://www.fxprimus.com',
    partnerUrl: 'https://clients.fxprimus.com/en/register?ref=50014146',
    copyUrl: 'https://ct.myprimusmarkets.com/copy/strategy',
    rank: 369,
  },
  gomarkets: {
    name: 'GoMarkets',
    icon: '/icons/gomarkets.png',
    href: 'https://www.gomarkets.com',
    partnerUrl: 'https://apply.gomarkets.com/opennewaccount/register/?Ic=HMOQ8&s=r3',
    copyUrl: 'https://ct.gomarkets.com/copy/strategy',
    rank: 398,
  },
  axiory: {
    name: 'Axiory',
    icon: '/icons/axiory.jpeg',
    href: 'https://www.axiory.com',
    partnerUrl: 'https://goglb.axiory.com/afs/come.php?cid=6072&ctgid=100&atype=1&brandid=7',
    copyUrl: 'https://ct.axiory.com/copy/strategy',
    rank: 450,
  },
  tradersway: {
    name: 'Tradersway',
    icon: '/icons/tradersway.jpg',
    href: 'https://www.tradersway.com',
    partnerUrl: 'https://www.tradersway.com?ib=1655940',
    copyUrl: 'https://ct.tradersway.com/copy/strategy',
    rank: 455,
  },
  fibogroup: {
    name: 'FiboGroup',
    icon: '/icons/fibogroup.jpeg',
    href: 'https://www.fibogroup.com',
    partnerUrl: 'https://www.fibogroup.com/?ref=IB_FishProvider',
    copyUrl: 'https://ct.fibogroup.com/copy/strategy',
    rank: 512,
  },
  tradeview: {
    name: 'TradeView',
    icon: '/icons/tradeview.png',
    href: 'https://www.tradeviewforex.com',
    partnerUrl: 'https://www.tradeviewlatam.com/en/forms/accounts/individual?ibla=230910',
    copyUrl: 'https://ct.tradeviewforex.com/copy/strategy',
    rank: 528,
  },
  topfx: {
    name: 'TopFX',
    icon: '/icons/topfx.png',
    href: 'https://www.topfx.com',
    partnerUrl: 'https://signup.topfx.com.sc/Registration/Main/Account?dest=live&isSpecAts=true&camp=7256',
    copyUrl: 'https://ct.topfx.com/copy/strategy',
    rank: 754,
  },
  fondex: {
    name: 'Fondex',
    icon: '/icons/fondex.png',
    href: 'https://www.fondex.com',
    partnerUrl: 'https://open.ctrader.com/?url=https%3A%2F%2Fct.fondex.com&lang=en&ctid=false&brokerName=fondex&ibPlantId=fondex&ibEnvironmentName=live&ibTraderId=93987',
    copyUrl: 'https://ct.fondex.com/copy/strategy',
    rank: 996,
  },
  scandinavianmarkets: {
    name: 'ScandinavianMarkets',
    icon: '/icons/scandinavianmarkets.jpg',
    href: 'https://www.scandinavianmarkets.com',
    partnerUrl: 'https://app.scandinavianmarkets.com/?key=2fd73abe29&pp=fc58e6',
    copyUrl: 'https://ct.scandinavianmarkets.com/copy/strategy',
    rank: 2083,
  },
  fxpig: {
    name: 'FXPig',
    icon: '/icons/fxfig.jpeg',
    href: 'https://www.fxpig.com',
    partnerUrl: 'https://portal.fxpig.com/register?ibid=234095',
    subIBUrl: 'https://ibportal.fxpig.com/register/?ib=234095',
    copyUrl: 'https://ct.fxpig.com/copy/strategy',
    rank: 2352,
  },
};

const metatraderPlatforms = {
  exness: {
    name: 'Exness',
    icon: '/icons/exness.svg',
    href: 'https://www.exness.com',
    partnerUrl: 'https://one.exness-track.com/a/u7q5nfkb',
    rank: 3,
  },
  roboforex: {
    name: 'RoboForex',
    icon: '/icons/roboforex.svg',
    href: 'https://www.roboforex.com',
    partnerUrl: 'https://my.roboforex.com/en/?a=vtft',
    rank: 8,
  },
  admiralmarkets: {
    name: 'AdmiralMarkets',
    icon: '/icons/admiralmarkets.png',
    href: 'https://www.admiralmarkets.com',
    partnerUrl: 'https://partners.admiralmarkets.com/3oceUI',
    rank: 35,
  },
  // avatrade: {
  //   name: 'AvaTrade',
  //   icon: '/icons/avatrade.png',
  //   href: 'https://www.avatrade.com',
  // rank: 64,
  // },
  fpmarkets: {
    name: 'FPMarkets',
    icon: '/icons/fpmarkets.png',
    href: 'https://www.fpmarkets.com',
    partnerUrl: 'https://www.fpmarkets.com/social-trading/?redir=stv&fpm-affiliate-utm-source=IB&fpm-affiliate-agt=22506',
    rank: 90,
  },
  fpmarketsPamm: {
    name: 'FPMarkets PAMM',
    icon: '/icons/fpmarkets.png',
    href: 'https://www.fpmarkets.com',
    partnerUrl: 'https://portal.fpmarkets.com/int-EN/register?redir=stv&fpm-affiliate-utm-source=IB&fpm-affiliate-agt=22506',
    rank: 90,
  },
  zulutrade: {
    name: 'ZuluTrade',
    icon: '/icons/zulutrade.png',
    href: 'https://www.zulutrade.com',
    partnerUrl: 'https://www.zulutrade.com/?ref=2643228&utm_medium=affiliate&utm_source=2643228&utm_campaign=affiliate',
    rank: 269,
  },
  alpari: {
    name: 'Alpari',
    icon: '/icons/alpari.jpg',
    href: 'https://www.alpari.org',
    partnerUrl: 'https://gobymylink.com/en/?partner_id=170008567',
    rank: 460,
  },
};

const ProviderTypeText: Record<string, string> = {
  [ProviderType.icmarkets]: ctraderPlatforms[ProviderType.icmarkets].name,
  [ProviderType.exness]: metatraderPlatforms[ProviderType.exness].name,
  [ProviderType.roboforex]: metatraderPlatforms[ProviderType.roboforex].name,
};

const ProviderTypePrice: Record<string, string> = {
  [ProviderType.icmarkets]: '5 USFP/month',
  [ProviderType.exness]: '5 USFP/month',
  [ProviderType.roboforex]: '5 USFP/month',
};

const AccountViewTypeText: Record<string, string> = {
  [AccountViewType.private]: 'Private',
  [AccountViewType.public]: 'Public',
};

const AccountTradeTypeText: Record<string, { text: string, color?: string }> = {
  [AccountTradeType.demo]: { text: 'Demo', color: 'gray' },
  [AccountTradeType.live]: { text: 'Live', color: 'green' },
};

const ProviderRoleText: Record<string, { text: string, description: string, color?: string }> = {
  [AccountRole.admin]: { text: 'Admin', description: 'Full rights', color: 'red' },
  [AccountRole.trader]: { text: 'Trader', description: 'Can trade', color: 'green' },
  [AccountRole.protector]: { text: 'Protector', description: 'Can close orders and lock users', color: 'purple' },
  [AccountRole.viewer]: { text: 'Viewer', description: 'View only' },
};

const CopyVolumeModeText: Record<string, { text: string, description: string }> = {
  [AccountCopyVolumeMode.auto]: { text: 'Auto', description: 'Scale Volume based on Balance ratio between Parent and Child' },
  [AccountCopyVolumeMode.fixedRatio]: { text: 'Fixed Ratio', description: 'Set Volume Ratio to a fixed number (not auto scale)' },
  [AccountCopyVolumeMode.fixedLot]: { text: 'Fixed Lot', description: 'Set Lot to a fixed number (not auto scale)' },
  [AccountCopyVolumeMode.autoWithRatio]: { text: 'Auto with Ratio', description: 'Scale Volume based on Balance ratio with additional Ratio' },
};

const LockTypeText: Record<string, string> = {
  [AccountLockType.open]: 'Lock Open Order',
  [AccountLockType.update]: 'Lock Update Order',
  [AccountLockType.close]: 'Lock Close Order',
  [AccountLockType.pairs]: 'Lock Pairs',
};

const activityFields = ['chats', 'confidences'];

export {
  AccountTradeTypeText,
  AccountViewTypeText,
  activityFields,
  CardVariant,
  CopyVolumeModeText,
  ctraderPlatforms,
  LockTypeText,
  metatraderPlatforms,
  ProviderRoleText,
  ProviderTypePrice,
  ProviderTypeText,
};
