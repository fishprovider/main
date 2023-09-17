import {
  CTraderAsset, CTraderBar, CTraderLightSymbol,
  CTraderPayloadType, CTraderQuoteType, CTraderSymbolDetail, CTraderTick,
  CTraderTrendbarPeriod, TCTraderConnection,
  transformBar, transformTick, validate,
} from '..';

export const getAssetList = async (
  connection: TCTraderConnection,
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    ctidTraderAccountId: Long;
    asset: CTraderAsset[];
  }>({
    name: 'ProtoOAAssetListReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_ASSET_LIST_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );

  const { asset } = res;
  return {
    ...res,
    assets: asset.map((item) => {
      const { name, assetId } = item;
      return {
        ...item,
        asset: name,
        assetId: assetId.toNumber().toString(),
      };
    }),
  };
};

export const getSymbolList = async (
  connection: TCTraderConnection,
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    ctidTraderAccountId: Long;
    symbol: CTraderLightSymbol[];
    // archivedSymbol?: ArchivedSymbol[];
  }>({
    name: 'ProtoOASymbolsListReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_SYMBOLS_LIST_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );

  const { symbol } = res;
  return {
    ...res,
    symbols: symbol.map((item) => {
      const {
        symbolName, symbolId, baseAssetId, quoteAssetId,
      } = item;
      return {
        ...item,
        symbol: symbolName,
        symbolId: symbolId.toNumber().toString(),
        baseAssetId: baseAssetId && baseAssetId.toNumber().toString(),
        quoteAssetId: quoteAssetId && quoteAssetId.toNumber().toString(),
      };
    }),
  };
};

export const getSymbolDetail = async (
  connection: TCTraderConnection,
  symbolIds: number[],
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    ctidTraderAccountId: Long;
    symbol: CTraderSymbolDetail[];
    // archivedSymbol?: ArchivedSymbol[];
  }>({
    name: 'ProtoOASymbolByIdReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId: symbolIds,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_SYMBOL_BY_ID_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );

  const { symbol } = res;
  return {
    ...res,
    symbols: symbol.map((item) => {
      const {
        symbolId, schedule, holiday, pipPosition, lotSize, minVolume, maxVolume,
      } = item;
      return {
        ...item,
        symbolId: symbolId.toNumber().toString(),
        pipSize: 1 / 10 ** pipPosition,
        lotSize: (lotSize && lotSize.toNumber() / 100),
        minVolume: (minVolume && minVolume.toNumber() / 100),
        maxVolume: (maxVolume && maxVolume.toNumber() / 100),
        schedule: schedule.map((itemSchedule) => ({
          ...itemSchedule,
          startSecond: itemSchedule.startSecond,
          endSecond: itemSchedule.endSecond,
        })),
        holiday: holiday?.map((itemHoliday) => ({
          ...itemHoliday,
          holidayId: itemHoliday.holidayId.toNumber().toString(),
          holidayDate: itemHoliday.holidayDate.toNumber(),
        })),
      };
    }),
  };
};

export const getTickData = async (
  connection: TCTraderConnection,
  symbolId: string,
  quoteType: CTraderQuoteType,
  fromTimestamp: number,
  toTimestamp: number,
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    ctidTraderAccountId: Long;
    tickData: CTraderTick[];
    hasMore: boolean;
  }>({
    name: 'ProtoOAGetTickDataReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId,
      type: quoteType,
      fromTimestamp,
      toTimestamp,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_GET_TICKDATA_RES,
      required: ['ctidTraderAccountId', 'tickData', 'hasMore'],
    },
    res,
  );

  const { tickData } = res;
  return {
    ...res,
    ticks: tickData.map(transformTick),
  };
};

export const getBarData = async (
  connection: TCTraderConnection,
  symbolId: string,
  period: CTraderTrendbarPeriod,
  fromTimestamp: number,
  toTimestamp: number,
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    ctidTraderAccountId: Long;
    period: CTraderTrendbarPeriod;
    timestamp: number;
    trendbar: CTraderBar[];
    symbolId?: Long;
  }>({
    name: 'ProtoOAGetTrendbarsReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId,
      period,
      fromTimestamp,
      toTimestamp,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_GET_TRENDBARS_RES,
      required: ['ctidTraderAccountId', 'period', 'timestamp'],
    },
    res,
  );

  const { trendbar } = res;
  return {
    ...res,
    bar: trendbar.map(transformBar),
  };
};

export const subSpot = async (
  connection: TCTraderConnection,
  symbolId: string,
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    ctidTraderAccountId: Long;
  }>({
    name: 'ProtoOASubscribeSpotsReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_SUBSCRIBE_SPOTS_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );
  return true;
};

export const unsubSpot = async (
  connection: TCTraderConnection,
  symbolId: string,
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    ctidTraderAccountId: Long;
  }>({
    name: 'ProtoOAUnsubscribeSpotsReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_UNSUBSCRIBE_SPOTS_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );
  return true;
};

export const subBar = async (
  connection: TCTraderConnection,
  symbolId: string,
  period: CTraderTrendbarPeriod,
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    ctidTraderAccountId: Long;
  }>({
    name: 'ProtoOASubscribeLiveTrendbarReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId,
      period,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_SUBSCRIBE_LIVE_TRENDBAR_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );
  return true;
};

export const unsubBar = async (
  connection: TCTraderConnection,
  symbolId: string,
  period: CTraderTrendbarPeriod,
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    ctidTraderAccountId: Long;
  }>({
    name: 'ProtoOAUnsubscribeLiveTrendbarReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId,
      period,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_UNSUBSCRIBE_LIVE_TRENDBAR_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );
  return true;
};

export const subDepth = async (
  connection: TCTraderConnection,
  symbolId: string,
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    ctidTraderAccountId: Long;
  }>({
    name: 'ProtoOASubscribeDepthQuotesReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_SUBSCRIBE_DEPTH_QUOTES_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );
  return true;
};

export const unsubDepth = async (
  connection: TCTraderConnection,
  symbolId: string,
) => {
  const res = await connection.sendGuaranteedCommand<{
    payloadType: CTraderPayloadType;
    ctidTraderAccountId: Long;
  }>({
    name: 'ProtoOAUnsubscribeDepthQuotesReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
      symbolId,
    },
  });
  validate(
    {
      payloadType: CTraderPayloadType.PROTO_OA_UNSUBSCRIBE_DEPTH_QUOTES_RES,
      required: ['ctidTraderAccountId'],
    },
    res,
  );
  return true;
};
