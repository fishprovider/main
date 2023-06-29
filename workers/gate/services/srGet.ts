const env = {
  apiPass: process.env.API_PASS,
};

const parseTimeFr = (timeFr: string) => {
  if (timeFr === 'Hour') return 'Hour4';
  if (timeFr === 'Weekly') return 'Daily';
  return timeFr;
};

const srGet = async ({ secret, symbolName, timeFr: timeFrRaw }: {
  secret: string;
  symbolName: string;
  timeFr: string;
}) => {
  if (secret !== env.apiPass) {
    return { error: 'Params error' };
  }

  const timeFr = parseTimeFr(timeFrRaw);

  const stat = await Mongo.collection<{
    _id: string;
    keyLevels: string[],
  }>('stats').findOne(
    {
      type: 'keyLevels',
      typeId: `${timeFr}-${symbolName}`,
      timeFr,
      symbol: symbolName,
    },
    {
      projection: {
        keyLevels: 1,
      },
    },
  );
  if (!stat) {
    return { error: 'No data' };
  }

  return { result: stat.keyLevels.join(',') };
};

export default srGet;
