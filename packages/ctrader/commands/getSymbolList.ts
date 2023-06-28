import { PayloadType } from '~constants/openApi';
import type { ConnectionType } from '~types/Connection.model';
import type { LightSymbol } from '~types/Symbol.model';
import validate from '~utils/validate';

interface SymbolListRes {
  payloadType: PayloadType;
  ctidTraderAccountId: Long;
  symbol: LightSymbol[];
  // archivedSymbol?: ArchivedSymbol[];
}

const getSymbolList = async (
  connection: ConnectionType,
) => {
  const res = await connection.sendGuaranteedCommand<SymbolListRes>({
    name: 'ProtoOASymbolsListReq',
    payload: {
      ctidTraderAccountId: connection.accountId,
    },
  });
  validate(
    {
      payloadType: PayloadType.PROTO_OA_SYMBOLS_LIST_RES,
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

export default getSymbolList;
