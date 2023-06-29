import type { Browser, Page } from 'puppeteer';

import { newBrowser, newPage } from '~libs/pup';
import type { LoginConfig, Token } from '~types/CTrader.model';

const env = {
  nodeEnv: process.env.NODE_ENV,
  pupProduct: process.env.PUPPETEER_PRODUCT || 'chrome',
};

const MAX_ATTEMPTS = 5;

const delay = (timeMS: number) => new Promise((resolve) => {
  setTimeout(resolve, timeMS);
});

const attemptHandler = async (
  handler: () => Promise<Token>,
  numAttempts = 0,
): Promise<Token | null> => {
  try {
    const result = await handler();
    return result;
  } catch (error) {
    if (numAttempts < MAX_ATTEMPTS) {
      Logger.error(`🔥 ${handler.name} failed (${numAttempts} attempts, retry in 5s)`, error);
      await delay(5000);
      const result = await attemptHandler(handler, numAttempts + 1);
      return result;
    }
    Logger.error(`🔥 ${handler.name} failed (${numAttempts} attempts)`, error);
    return null;
  }
};

const pageHandler = async (browser: Browser, page: Page, config: LoginConfig) => {
  const { user, pass, clientId } = config;
  const appId = clientId.split('_')[0];

  await page.goto('https://openapi.ctrader.com/apps', { waitUntil: 'networkidle2' });
  await page.click('#sso-login');

  Logger.debug('Delay 10s');
  await page.waitForTimeout(10000);

  const pages = await browser.pages();
  const loginPage = pages.find((x) => x.url().includes('login'));

  if (loginPage == null) {
    throw new Error('Failed to open CTrader login page');
  }

  await loginPage.type('[name=id]', user);
  await loginPage.type('[name=password]', pass);
  await loginPage.click('[type=submit]');

  await page.waitForNavigation({ waitUntil: ['networkidle2'] });
  await page.goto(`https://openapi.ctrader.com/apps/${appId}/playground`, {
    waitUntil: 'networkidle2',
  });

  await page.waitForSelector('[value=trading]');
  await page.click('[value=trading]');

  await page.waitForSelector('.btn-success[type="submit"]');
  await page.click('.btn-success[type="submit"]');

  await page.waitForSelector('.btn-success[type="submit"]');
  await page.click('.btn-success[type="submit"]');

  await page.waitForSelector('pre');
  const result: Record<string, any> = {};

  const tokenEl = await page.$('pre');
  if (tokenEl) {
    const tokenRaw = await tokenEl.evaluate((el) => el.innerText);
    const rows = tokenRaw.split('\n');
    rows.forEach((row: string) => {
      const [key, value] = row.split(' => ');
      if (key) {
        result[key] = value;
      } else {
        Logger.error('🔥 Failed to parse token');
      }
    });
  } else {
    Logger.error('🔥 Failed to get token');
  }
  return result;
};

const browserHandler = async (config: LoginConfig) => {
  const { headless } = config;
  const browser = await newBrowser(
    env.nodeEnv === 'development' ? false : headless !== false,
    env.pupProduct,
  );
  try {
    const page = await newPage(browser);
    const result = await pageHandler(browser, page, config);
    Logger.info('New token', result);
    return {
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expireSec: result.expires_in,
    };
  } catch (error) {
    Logger.error('Failed to get token', error);
    throw new Error('Failed to get token');
  } finally {
    browser.close();
  }
};

const getTokens = async (config: LoginConfig) => {
  const result = await attemptHandler(
    () => browserHandler(config),
  );
  if (!result) throw new Error('Failed at getTokens');
  return result;
};

export default getTokens;
