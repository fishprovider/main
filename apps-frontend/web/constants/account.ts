import {
  CopyVolumeMode, LockType, ProviderTradeType, ProviderType, ProviderViewType,
} from '@fishprovider/utils/dist/constants/account';
import { Roles } from '@fishprovider/utils/dist/constants/user';

// import { isLive, isProd } from '~utils';

// const getTopProviderIds = () => {
//   if (isProd) {
//     return isLive
//       ? ['earth', 'water', 'air', 'fire', 'whale']
//       : ['octopus', 'oyster', 'nemo', 'dory', 'seal', 'exne', 'robo'];
//   }
//   return ['ctra', 'exne', 'robo', 'octopus'];
// };

// const TopProviderIds = getTopProviderIds();
const TopProviderIds = ['earth', 'water', 'air', 'fire'];

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
    rank: 20,
  },
  fpmarkets: {
    name: 'FPMarkets',
    icon: '/icons/fpmarkets.png',
    href: 'https://www.fpmarkets.com',
    partnerUrl: 'https://www.fpmarkets.com/?redir=stv&fpm-affiliate-utm-source=IB&fpm-affiliate-agt=22506',
    copyUrl: 'https://app.fpmarkets.com/copy/strategy',
    rank: 90,
  },
  topfx: {
    name: 'TopFX',
    icon: '/icons/topfx.png',
    href: 'https://www.topfx.com',
    partnerUrl: 'https://signup.topfx.com.sc/Registration/Main/Account?dest=live&isSpecAts=true&camp=7256',
    copyUrl: 'https://ct.topfx.com/copy/strategy',
    rank: 164,
  },
  primus: {
    name: 'Primus',
    icon: '/icons/primus.png',
    href: 'https://www.fxprimus.com',
    partnerUrl: 'https://clients.fxprimus.com/en/register?ref=50014146',
    copyUrl: 'https://ct.myprimusmarkets.com/copy/strategy',
    rank: 320,
  },
  axiory: {
    name: 'Axiory',
    icon: '/icons/axiory.jpeg',
    href: 'https://www.axiory.com',
    partnerUrl: 'https://goglb.axiory.com/afs/come.php?cid=6072&ctgid=100&atype=1&brandid=7',
    copyUrl: 'https://ct.axiory.com/copy/strategy',
    rank: 321,
  },
  skilling: {
    name: 'Skilling',
    icon: '/icons/skilling.jpg',
    href: 'https://www.skilling.com',
    partnerUrl: 'https://go.skillingpartners.com/visit/?bta=35949&brand=skilling',
    copyUrl: 'https://ct.skilling.com/copy/strategy',
    rank: 338,
  },
  litefinance: {
    name: 'LiteFinance',
    icon: '/icons/litefinance.png',
    href: 'https://www.litefinance.org',
    partnerUrl: 'https://litefinance.vn/?uid=847322350',
    copyUrl: 'https://app.litefinance.org/copy/strategy',
    rank: 339,
  },
  tradeview: {
    name: 'TradeView',
    icon: '/icons/tradeview.png',
    href: 'https://www.tradeviewforex.com',
    partnerUrl: 'https://www.tradeviewlatam.com/en/forms/accounts/individual?ibla=230910',
    copyUrl: 'https://ct.tradeviewforex.com/copy/strategy',
    rank: 487,
  },
  tradersway: {
    name: 'Tradersway',
    icon: '/icons/tradersway.jpg',
    href: 'https://www.tradersway.com',
    partnerUrl: 'https://www.tradersway.com?ib=1655940',
    copyUrl: 'https://ct.tradersway.com/copy/strategy',
    rank: 550,
  },
  gomarkets: {
    name: 'GoMarkets',
    icon: '/icons/gomarkets.png',
    href: 'https://www.gomarkets.com',
    partnerUrl: 'https://apply.gomarkets.com/opennewaccount/register/?Ic=HMOQ8&s=r3',
    copyUrl: 'https://ct.gomarkets.com/copy/strategy',
    rank: 580,
  },
  fibogroup: {
    name: 'FiboGroup',
    icon: '/icons/fibogroup.jpeg',
    href: 'https://www.fibogroup.com',
    partnerUrl: 'https://www.fibogroup.com/?ref=IB_FishProvider',
    copyUrl: 'https://ct.fibogroup.com/copy/strategy',
    rank: 899,
  },
  fondex: {
    name: 'Fondex',
    icon: '/icons/fondex.png',
    href: 'https://www.fondex.com',
    partnerUrl: 'https://open.ctrader.com/?url=https%3A%2F%2Fct.fondex.com&lang=en&ctid=false&brokerName=fondex&ibPlantId=fondex&ibEnvironmentName=live&ibTraderId=93987',
    copyUrl: 'https://ct.fondex.com/copy/strategy',
    rank: 2200,
  },
  scandinavianmarkets: {
    name: 'ScandinavianMarkets',
    icon: '/icons/scandinavianmarkets.jpg',
    href: 'https://www.scandinavianmarkets.com',
    partnerUrl: 'https://app.scandinavianmarkets.com/?key=2fd73abe29&pp=fc58e6',
    copyUrl: 'https://ct.scandinavianmarkets.com/copy/strategy',
    rank: 3500,
  },
  fxpig: {
    name: 'FXPig',
    icon: '/icons/fxfig.jpeg',
    href: 'https://www.fxpig.com',
    partnerUrl: 'https://portal.fxpig.com/register?ibid=234095',
    subIBUrl: 'https://ibportal.fxpig.com/register/?ib=234095',
    copyUrl: 'https://ct.fxpig.com/copy/strategy',
    rank: 4000,
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
    rank: 28,
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
    partnerUrl: 'https://www.zulutrade.com/?ref=2488273&utm_medium=affiliate&utm_source=2488273&utm_campaign=affiliate',
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
};

const ProviderTypePrice: Record<string, string> = {
  [ProviderType.icmarkets]: '5 USFP/month',
  [ProviderType.exness]: '5 USFP/month',
};

const ProviderViewTypeText: Record<string, string> = {
  [ProviderViewType.private]: 'Private',
  [ProviderViewType.public]: 'Public',
};

const ProviderTradeTypeText: Record<string, { text: string, color?: string }> = {
  [ProviderTradeType.demo]: { text: 'Demo', color: 'gray' },
  [ProviderTradeType.live]: { text: 'Live', color: 'green' },
};

const ProviderRoleText: Record<string, { text: string, description: string, color?: string }> = {
  [Roles.admin]: { text: 'Admin', description: 'Full rights', color: 'red' },
  [Roles.trader]: { text: 'Trader', description: 'Can trade', color: 'green' },
  [Roles.protector]: { text: 'Protector', description: 'Can close orders and lock users', color: 'purple' },
  [Roles.viewer]: { text: 'Viewer', description: 'View only' },
};

const CopyVolumeModeText: Record<string, { text: string, description: string }> = {
  [CopyVolumeMode.auto]: { text: 'Auto', description: 'Scale Volume based on Balance ratio between Parent and Child' },
  [CopyVolumeMode.fixedRatio]: { text: 'Fixed Ratio', description: 'Set Volume Ratio to a fixed number (not auto scale)' },
  [CopyVolumeMode.fixedLot]: { text: 'Fixed Lot', description: 'Set Lot to a fixed number (not auto scale)' },
  [CopyVolumeMode.autoWithRatio]: { text: 'Auto with Ratio', description: 'Scale Volume based on Balance ratio with additional Ratio' },
};

const LockTypeText: Record<string, string> = {
  [LockType.open]: 'Lock Open Order',
  [LockType.update]: 'Lock Update Order',
  [LockType.close]: 'Lock Close Order',
  [LockType.pairs]: 'Lock Pairs',
};

const activityFields = ['chats', 'confidences'];

export {
  activityFields,
  CardVariant,
  CopyVolumeModeText,
  ctraderPlatforms,
  LockTypeText,
  metatraderPlatforms,
  ProviderRoleText,
  ProviderTradeTypeText,
  ProviderTypePrice,
  ProviderTypeText,
  ProviderViewTypeText,
  TopProviderIds,
};
