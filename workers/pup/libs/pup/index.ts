import fs from 'fs';
import type { Browser, Page, Product } from 'puppeteer';
import puppeteerCore from 'puppeteer-core';
import puppeteer from 'puppeteer-extra';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import AnonymizeUAPlugin from 'puppeteer-extra-plugin-anonymize-ua';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

const MAX_ATTEMPTS = 10;

puppeteer.use(AnonymizeUAPlugin());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

const debugPage = async (page: Page) => {
  await page.screenshot({ path: 'tmp.page.png' });
  const content = await page.content();
  fs.writeFileSync('tmp.page.html', content);
};

const gotoAttempt = async (
  handler: (isRetried?: boolean) => Promise<void>,
  maxAttempts = MAX_ATTEMPTS,
  numAttempts = 0,
) => {
  try {
    await handler();
  } catch (error) {
    if (numAttempts < maxAttempts) {
      Logger.error(
        `[pup] gotoAttempt failed with ${numAttempts}/${maxAttempts} attempts, retrying now`,
        error,
      );
      await gotoAttempt(() => handler(true), maxAttempts, numAttempts + 1);
    } else {
      Logger.error(
        `[pup] gotoAttempt failed with ${numAttempts}/${maxAttempts} attempts, throwing error now`,
        error,
      );
      throw error;
    }
  }
};

const newPage = async (browser: Browser, defaultTimeout = 60000) => {
  const page = await browser.newPage();
  page.setDefaultTimeout(defaultTimeout);
  return page;
};

const newBrowser = async (
  headless: boolean,
  product: string,
) => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN || process.env.PUPPETEER_EXEC_PATH,
    headless: headless ? 'new' : false,
    args: [
      '--mute-audio',
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
    defaultViewport: {
      width: 1366,
      height: 768,
      isLandscape: true,
    },
    product: product as Product,
  });
  return browser;
};

export {
  debugPage,
  gotoAttempt,
  newBrowser,
  newPage,
};
