import type { Page } from 'puppeteer-core';

import { gotoAttempt } from '~libs/pup';

const gotoProviderPage = async (page: Page, strategyId: string) => {
  Logger.info(`[pup] Navigating to Provider ${strategyId}...`);

  await gotoAttempt(async (isRetried) => {
    if (isRetried) await page.reload();
    else {
      const url = `https://ct.icmarkets.com/copy/strategy/${strategyId}`;
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 0,
      });
    }
  });
};

export default gotoProviderPage;
