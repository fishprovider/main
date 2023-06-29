import type { Page } from 'puppeteer';

const scrollToEl = async (page:Page, field: string) => {
  await page.waitForXPath(`(//*[contains(text(),"${field}")])[1]`);
  const els = await page.$x(`(//*[contains(text(),"${field}")])[1]`);
  if (els[0]) {
    await page.evaluate((el) => {
      // @ts-ignore - puppeteer
      el.scrollIntoView();
      // @ts-ignore - puppeteer
      el.click();
    }, els[0]);
  }
};

const getVal = async (
  page: Page,
  field: string,
  {
    parentLevel = 2, position = 1, childrenPos = 1, type = 'number', currency = 'USD',
  } = {},
) => {
  await page.waitForXPath(`(//*[contains(text(),"${field}")])[${position}]`);
  const els = await page.$x(`(//*[contains(text(),"${field}")])[${position}]`);
  if (els[0]) {
    const val = await page.evaluate(
      (el, level, childPos) => {
        let rootNode = el;
        let count = 0;
        while (count < level) {
          // @ts-ignore - puppeteer
          rootNode = rootNode?.parentNode;
          count += 1;
        }
        // @ts-ignore - puppeteer
        return rootNode.children[childPos].innerText || '';
      },
      els[0],
      parentLevel,
      childrenPos,
    );
    if (type === 'number') {
      const res = +(val.replace(/[\s+%]/g, '').replace(currency, '') || 0);
      Logger.debug(field, res);
      return res;
    }
    Logger.debug(field, val);
    return val;
  }
  Logger.debug(field, 0);
  return 0;
};

const getStrategyInfo = async (page: Page) => {
  await scrollToEl(page, 'Details');
  const interval = setInterval(async () => {
    page.mouse.wheel({ deltaY: 100 });

    const [whatsNewEle] = await page.$x('(//*[contains(text(),"What\'s New")])');
    if (whatsNewEle) {
      console.log('Whats New Found');
      const [OkBtn] = await page.$x('//button[contains(text(),\'OK\')]');
      if (OkBtn) {
        console.log('OK Button Found');
        // @ts-ignore - puppeteer
        await OkBtn.click();
      }
    }
  }, 500);

  const result: Record<string, any> = {};

  const maxCount = 60;
  let count = 0;
  result.profitFactor = await getVal(page, 'Profit Factor');
  result.allCopiers = await getVal(page, 'All Time Copiers');
  while (count < maxCount && (result.profitFactor === 0 || result.allCopiers === 0)) {
    await page.waitForTimeout(10000);
    result.profitFactor = await getVal(page, 'Profit Factor');
    result.allCopiers = await getVal(page, 'All Time Copiers');
    count += 1;
  }

  clearInterval(interval);

  result.roi = await getVal(page, 'All Time ROI', { parentLevel: 3, childrenPos: 2 });
  result.currency = await getVal(page, 'Currency', { parentLevel: 4, type: 'string' });

  result.profit = await getVal(page, 'Net Profit');
  // result.profitFactor = await getVal(page, 'Profit Factor');
  // result.profitFactor = await getVal(page, 'Profit Factor');
  result.profitPercent = await getVal(page, 'Percent Profitable');
  result.maxDrawdown = await getVal(page, 'Max Balance Drawdown');
  result.startBalance = await getVal(page, 'Starting Balance');
  result.balance = await getVal(page, 'Current Balance');
  result.equity = await getVal(page, 'Equity', { position: 2 });
  result.deposits = await getVal(page, 'Deposits');
  result.withdrawals = await getVal(page, 'Withdrawals');
  result.margin = await getVal(page, 'Margin');
  result.activeSince = await getVal(page, 'Active since', { type: 'string' });

  result.activeCopier = await getVal(page, 'Currently Copying');
  result.liveCopier = await getVal(page, 'Active Live Copiers');
  result.demoCopier = await getVal(page, 'Active Demo Copiers');
  // result.allCopiers = await getVal(page, 'All Time Copiers');
  // result.allCopiers = await getVal(page, 'All Time Copiers');
  result.copyFund = await getVal(page, 'Copying Funds ', { currency: result.currency });

  result.copierStatUpdatedAt = new Date();
  result.roiStatUpdatedAt = new Date();

  Logger.info(`[pup] Strategy Info: ${JSON.stringify(result)}`);
  return result;
};

export default getStrategyInfo;
