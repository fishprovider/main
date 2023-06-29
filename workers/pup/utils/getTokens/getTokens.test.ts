import getTokens from './getTokens';

const env = {
  user: process.env.CTRADER_USER || '',
  pass: process.env.CTRADER_PASS || '',
  showMember: process.env.CTRADER_SHOW_BROWSER,
  clientId: process.env.CTRADER_CLIENT_ID || '',
};

const config = {
  user: env.user,
  pass: env.pass,
  headless: !env.showMember,
  clientId: env.clientId,
};

test('getTokens', async () => {
  const result = await getTokens(config);

  expect(result).toBeDefined();
  expect(result.accessToken).toBeDefined();
  expect(result.refreshToken).toBeDefined();
  expect(result.expireSec).toBeDefined();
});
