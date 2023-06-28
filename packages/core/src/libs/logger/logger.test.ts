test('logger warn', async () => {
  Logger.warn('test logger warn');

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });
});

test('logger error', async () => {
  Logger.error('test logger error');

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 5000);
  });
});
