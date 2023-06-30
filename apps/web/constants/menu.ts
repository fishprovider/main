import Routes from '~libs/routes';

const menuItems = [
  {
    key: 'home',
    label: 'Home',
    href: Routes.home,
  },
  {
    key: 'about',
    label: 'About Us',
    href: Routes.about,
  },
  {
    key: 'plan',
    label: 'Plans',
    href: Routes.plans,
  },
  {
    key: 'strategies',
    label: 'Strategies',
    href: Routes.strategies,
  },
  {
    key: 'blog',
    label: 'Blog',
    href: Routes.blog,
  },
  {
    key: 'faq',
    label: 'FAQ',
    href: Routes.faq,
  },
];

const walletMenuItems = [
  {
    key: 'wallet',
    label: 'Wallet',
    href: Routes.wallet,
  },
  {
    key: 'deposit',
    label: 'Deposit',
    href: Routes.deposit,
  },
  {
    key: 'withdraw',
    label: 'Withdraw',
    href: Routes.withdraw,
  },
  {
    key: 'transfer',
    label: 'Transfer',
    href: Routes.transfer,
  },
  // {
  //   key: 'swap',
  //   label: 'Swap',
  //   href: Routes.swap,
  // },
  // {
  //   key: 'pay',
  //   label: 'Pay',
  //   href: Routes.pay,
  // },
  {
    key: 'invest',
    label: 'Invest',
    href: Routes.invest,
  },
  // {
  //   key: 'verify',
  //   label: 'Verify',
  //   href: Routes.verify,
  // },
];

export {
  menuItems,
  walletMenuItems,
};
