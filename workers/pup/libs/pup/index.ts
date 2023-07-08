import fs from 'fs';
import type { Page } from 'puppeteer-core';
import puppeteer from 'puppeteer-extra';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import AnonymizeUAPlugin from 'puppeteer-extra-plugin-anonymize-ua';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { AsyncReturnType } from 'type-fest';

const env = {
  nodeEnv: process.env.NODE_ENV,
};

const MAX_ATTEMPTS = 10;

puppeteer.use(AnonymizeUAPlugin());
puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin());

type Browser = AsyncReturnType<typeof puppeteer.launch>;

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

const newPage = async (browser: Browser, defaultTimeout = 600000) => {
  const page = await browser.newPage();
  page.setDefaultTimeout(defaultTimeout);
  return page;
};

const newBrowser = async (
  headless = (env.nodeEnv !== 'development'),
) => {
  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
      || process.env.GOOGLE_CHROME_BIN
      || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    channel: 'chrome',
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
  });
  return browser;
};

export {
  debugPage,
  gotoAttempt,
  newBrowser,
  newPage,
};
