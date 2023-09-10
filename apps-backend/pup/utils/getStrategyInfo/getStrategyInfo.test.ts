import gotoProviderPage from '~utils/gotoProviderPage';
import login from '~utils/login';

import getStrategyInfo from './getStrategyInfo';

const env = {
  user: process.env.CTRADER_USER || '',
  pass: process.env.CTRADER_PASS || '',
  showBrowser: process.env.CTRADER_SHOW_BROWSER,
  strategyId: process.env.CTRADER_STRATEGY_ID || '',
};

const config = {
  user: env.user,
  pass: env.pass,
  headless: !env.showBrowser,
};

test('getStrategyInfo', async () => {
  const { browser, page } = await login(config);
  try {
    await gotoProviderPage(page, env.strategyId);
    const info = await getStrategyInfo(page);

    expect(info.roi).toBeDefined();
    expect(info.currency).toBeDefined();
    expect(info.profit).toBeDefined();
    expect(info.profitPercent).toBeDefined();
    expect(info.startBalance).toBeDefined();
    expect(info.balance).toBeDefined();
    expect(info.equity).toBeDefined();
    expect(info.deposits).toBeDefined();
    expect(info.withdrawals).toBeDefined();
    expect(info.margin).toBeDefined();
    expect(info.activeSince).toBeDefined();

    expect(info.activeCopier).toBeDefined();
    expect(info.liveCopier).toBeDefined();
    expect(info.demoCopier).toBeDefined();
    expect(info.allCopiers).toBeDefined();
    expect(info.copyFund).toBeDefined();
  } finally {
    await browser.close();
  }
});
